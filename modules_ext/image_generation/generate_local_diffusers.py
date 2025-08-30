import os
import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
from pathlib import Path
import argparse
from tqdm import tqdm
from PIL import Image

# Default configuration
DEFAULT_INPUT_FILE = 'img_desc.txt'
DEFAULT_OUTPUT_DIR = 'generated_images'
DEFAULT_MODEL = "runwayml/stable-diffusion-v1-5"  # Smaller model that works well on most GPUs
DEFAULT_STYLE = """
Coloring book style, black and white line art, high contrast, clean lines,
no shading, white background, suitable for children's coloring book,
simple and clear outlines, minimal details, no text, no watermark
"""

def read_image_descriptions(filename):
    """Read image descriptions from the input file."""
    descriptions = {}
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '|' in line:
                    filename, description = line.split('|', 1)
                    descriptions[filename.strip()] = description.strip()
        return descriptions
    except FileNotFoundError:
        print(f"Error: Input file '{filename}' not found.")
        return None

def load_model(model_name, device="cuda" if torch.cuda.is_available() else "cpu"):
    """Load the Stable Diffusion model."""
    print(f"Loading model: {model_name}...")
    
    # Use FP16 for better performance if GPU is available
    torch_dtype = torch.float16 if device == "cuda" else torch.float32
    
    pipe = StableDiffusionPipeline.from_pretrained(
        model_name,
        torch_dtype=torch_dtype,
        safety_checker=None,  # Disable safety checker for more consistent results
    )
    
    # Enable attention slicing for lower memory usage
    pipe.enable_attention_slicing()
    pipe = pipe.to(device)
    
    # Use DPMSolver for faster inference
    pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
    
    print(f"Model loaded on {device}.")
    return pipe

def generate_image(pipe, prompt, output_path, width=512, height=512, style_prompt=DEFAULT_STYLE, device="cuda" if torch.cuda.is_available() else "cpu"):
    """Generate an image using the loaded model."""
    try:
        # Add style prompts for consistent cartoon/coloring book style
        enhanced_prompt = f"{prompt}. {style_prompt}"
        
        print(f"\nGenerating: {os.path.basename(output_path)}")
        print(f"Prompt: {prompt}")
        
        # Generate the image
        with torch.autocast(device):
            image = pipe(
                enhanced_prompt,
                width=width,
                height=height,
                num_inference_steps=30,
                guidance_scale=7.5,
                negative_prompt="text, watermark, signature, dark, blurry, shaded, grayscale, photo, realistic, complex, detailed",
            ).images[0]
        
        # Save the image
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        image.save(output_path)
        print(f"✓ Saved: {output_path}")
        return True
        
    except Exception as e:
        print(f"✗ Error generating {os.path.basename(output_path)}: {str(e)}")
        print(f"Prompt used: {enhanced_prompt}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Generate coloring book images using local Stable Diffusion')
    parser.add_argument('--input', '-i', default=DEFAULT_INPUT_FILE,
                      help=f'Input file with image descriptions (default: {DEFAULT_INPUT_FILE})')
    parser.add_argument('--output', '-o', default=DEFAULT_OUTPUT_DIR,
                      help=f'Output directory for generated images (default: {DEFAULT_OUTPUT_DIR})')
    parser.add_argument('--model', '-m', default=DEFAULT_MODEL,
                      help=f'Model to use (default: {DEFAULT_MODEL})')
    parser.add_argument('--width', type=int, default=512, help='Image width (default: 512)')
    parser.add_argument('--height', type=int, default=512, help='Image height (default: 512)')
    parser.add_argument('--skip-existing', action='store_true', help='Skip existing files')
    parser.add_argument('--cpu', action='store_true', help='Force CPU mode')
    
    args = parser.parse_args()
    
    # Set device
    device = "cpu" if args.cpu or not torch.cuda.is_available() else "cuda"
    if device == "cuda":
        print(f"Using GPU: {torch.cuda.get_device_name(0)}")
    else:
        print("Using CPU (this will be slower)")
    
    # Load the model
    pipe = load_model(args.model, device)
    
    # Read image descriptions
    print(f"\nReading image descriptions from: {args.input}")
    images = read_image_descriptions(args.input)
    
    if not images:
        print("No valid image descriptions found.")
        return
    
    print(f"Found {len(images)} images to generate")
    print(f"Output directory: {args.output}")
    print(f"Using model: {args.model}")
    print("="*50 + "\n")
    
    # Generate images one by one
    success_count = 0
    for filename, description in tqdm(images.items(), desc="Generating images"):
        output_path = os.path.join(args.output, filename)
        
        # Skip if file already exists and --skip-existing is set
        if args.skip_existing and os.path.exists(output_path):
            print(f"Skipping existing: {filename}")
            success_count += 1
            continue
            
        # Determine dimensions based on filename
        if any(x in filename.lower() for x in ['banner', 'category']):
            width, height = (1024, 512)  # Wider format for banners
        elif 'icon' in filename.lower():
            width, height = (512, 512)   # Square for icons
        else:
            width, height = (args.width, args.height)
            
        # Generate the image
        if generate_image(pipe, description, output_path, width, height, device=device):
            success_count += 1
    
    print("\n" + "="*50)
    print(f"Image generation complete!")
    print(f"Successfully generated: {success_count}/{len(images)} images")
    print(f"Output directory: {os.path.abspath(args.output)}")
    print("="*50)

if __name__ == "__main__":
    print("\n" + "="*50)
    print("Kids Coloring AI - Local Image Generator (Diffusers)")
    print("="*50)
    print("This script generates coloring book style images using local Stable Diffusion")
    print("The model will be downloaded on first run (about 2-4GB disk space required)")
    print("="*50 + "\n")
    
    try:
        main()
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        print("Make sure you have enough disk space and a stable internet connection.")
        print("For GPU acceleration, ensure CUDA is properly installed.")
