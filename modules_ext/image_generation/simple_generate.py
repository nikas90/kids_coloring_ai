import os
import torch
from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler
from pathlib import Path
import argparse
from tqdm import tqdm
from PIL import Image

# Check for CUDA availability
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
print(f"Using device: {device}")
print(f"Using torch dtype: {torch_dtype}")

# Default configuration
DEFAULT_INPUT_FILE = 'img_desc.txt'
DEFAULT_OUTPUT_DIR = 'generated_images'
DEFAULT_MODEL = "runwayml/stable-diffusion-v1-5"
DEFAULT_STYLE = """
Coloring book style, black and white line art, high contrast, clean lines,
no shading, white background, suitable for children's coloring book,
simple and clear outlines, minimal details, no text, no watermark
"""

def load_model(model_name, torch_dtype=torch.float16):
    """Load the model with optimized settings for GPU."""
    print(f"Loading model: {model_name}")
    pipe = StableDiffusionPipeline.from_pretrained(
        model_name,
        torch_dtype=torch_dtype,
        safety_checker=None,  # Disable safety checker for better performance
        requires_safety_checker=False
    ).to(device)
    
    # Enable attention slicing and xformers for better performance
    pipe.enable_attention_slicing()
    if torch.cuda.is_available():
        try:
            pipe.enable_xformers_memory_efficient_attention()
            print("Enabled xformers memory efficient attention")
        except:
            print("Xformers not available, using default attention")
    
    # Use DPMSolver for faster inference with fewer steps
    pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
    
    return pipe

def generate_image(pipe, prompt, style, output_path, steps=30, guidance_scale=7.5):
    """Generate a single image with the given prompt and style."""
    full_prompt = f"{prompt}, {style}"
    print(f"Generating image for: {prompt}")
    
    with torch.inference_mode():
        image = pipe(
            full_prompt,
            num_inference_steps=steps,
            guidance_scale=guidance_scale,
            generator=torch.Generator(device).manual_seed(42)  # For reproducibility
        ).images[0]
    
    image.save(output_path)
    return image

def main():
    print("\n" + "="*50)
    print("Kids Coloring AI - Simple Image Generator (GPU)")
    print("="*50)
    print("This script generates coloring book style images using Stable Diffusion")
    print("The model will be downloaded on first run (about 2-4GB disk space required)")
    print("="*50 + "\n")

    # Create output directory if it doesn't exist
    output_dir = Path(DEFAULT_OUTPUT_DIR).absolute()
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {output_dir}")

    # Load the model
    print(f"Loading model: {DEFAULT_MODEL}")
    pipe = StableDiffusionPipeline.from_pretrained(
        DEFAULT_MODEL,
        torch_dtype=torch_dtype,
        safety_checker=None,
        requires_safety_checker=False
    ).to(device)
    
    # Enable attention slicing for lower memory usage
    pipe.enable_attention_slicing()
    
    # Read image descriptions
    input_file = Path(DEFAULT_INPUT_FILE)
    if not input_file.exists():
        print(f"Error: Input file '{input_file}' not found.")
        return

    success_count = 0
    total_count = 0
    
    with open(input_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
                
            total_count += 1
            try:
                if '|' in line:
                    filename, description = line.split('|', 1)
                    filename = filename.strip()
                    description = description.strip()
                else:
                    filename = f"image_{total_count:03d}.jpg"
                    description = line
                
                output_path = output_dir / filename
                
                print(f"\nGenerating: {output_path}")
                print(f"Prompt: {description}")
                
                # Generate the image
                image = pipe(
                    f"{description}, {DEFAULT_STYLE}",
                    num_inference_steps=30,
                    guidance_scale=7.5,
                    generator=torch.Generator(device).manual_seed(42)
                ).images[0]
                
                # Save the image
                image.save(output_path)
                print(f"✓ Saved: {output_path}")
                success_count += 1
                
            except Exception as e:
                print(f"✗ Error generating {filename if 'filename' in locals() else 'image'}: {str(e)}")

    print("\n" + "="*50)
    print("Image generation complete!")
    print(f"Successfully generated: {success_count}/{total_count} images")
    print(f"Output directory: {output_dir}")
    print("="*50 + "\n")

if __name__ == "__main__":
    main()
