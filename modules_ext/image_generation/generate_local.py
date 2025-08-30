import os
import time
from pathlib import Path
import argparse
from tqdm import tqdm
import requests
from io import BytesIO
from PIL import Image
import ollama

# Default configuration
DEFAULT_INPUT_FILE = 'img_desc.txt'
DEFAULT_OUTPUT_DIR = 'generated_images'
DEFAULT_MODEL = 'sdxl'  # Default Ollama model
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

def generate_image(prompt, output_path, model_name=DEFAULT_MODEL, width=800, height=1000, style_prompt=DEFAULT_STYLE):
    """Generate an image using local Ollama model."""
    try:
        # Add style prompts for consistent cartoon/coloring book style
        enhanced_prompt = f"{prompt}. {style_prompt}"
        
        print(f"\nGenerating: {os.path.basename(output_path)}")
        print(f"Model: {model_name}")
        print(f"Prompt: {prompt}")
        
        # Generate image using Ollama
        response = ollama.generate(
            model=model_name,
            prompt=enhanced_prompt,
            images=None,  # For text-to-image
            options={
                'num_inference_steps': 30,
                'guidance_scale': 7.5,
                'width': width,
                'height': height,
                'negative_prompt': 'text, watermark, signature, dark, blurry, shaded, grayscale, photo, realistic, complex, detailed',
            }
        )
        
        # Save the generated image
        if response and 'image' in response:
            img = Image.open(BytesIO(response['image']))
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
                
            img.save(output_path)
            print(f"✓ Saved: {output_path}")
            return True
            
    except Exception as e:
        print(f"✗ Error generating {os.path.basename(output_path)}: {str(e)}")
        print(f"Prompt used: {enhanced_prompt}")
    
    return False

def check_ollama_models():
    """Check available Ollama models."""
    try:
        models = ollama.list()
        print("\nAvailable models:")
        for model in models.get('models', []):
            print(f"- {model['name']} (digest: {model['digest']})")
        return True
    except Exception as e:
        print(f"Error checking Ollama models: {e}")
        print("\nMake sure Ollama is running and you have pulled the model first.")
        print("Example: ollama pull sdxl")
        return False

def main():
    parser = argparse.ArgumentParser(description='Generate coloring book images using local Ollama')
    parser.add_argument('--input', '-i', default=DEFAULT_INPUT_FILE,
                      help=f'Input file with image descriptions (default: {DEFAULT_INPUT_FILE})')
    parser.add_argument('--output', '-o', default=DEFAULT_OUTPUT_DIR,
                      help=f'Output directory for generated images (default: {DEFAULT_OUTPUT_DIR})')
    parser.add_argument('--model', '-m', default=DEFAULT_MODEL,
                      help=f'Ollama model to use (default: {DEFAULT_MODEL})')
    parser.add_argument('--width', type=int, default=800, help='Image width (default: 800)')
    parser.add_argument('--height', type=int, default=1000, help='Image height (default: 1000)')
    parser.add_argument('--skip-existing', action='store_true', help='Skip existing files')
    parser.add_argument('--list-models', action='store_true', help='List available Ollama models')
    
    args = parser.parse_args()
    
    if args.list_models:
        check_ollama_models()
        return
    
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
            width, height = (1200, 600)  # Wider format for banners
        elif 'icon' in filename.lower():
            width, height = (512, 512)   # Square for icons
        else:
            width, height = (args.width, args.height)
            
        # Generate the image
        if generate_image(description, output_path, args.model, width, height):
            success_count += 1
    
    print("\n" + "="*50)
    print(f"Image generation complete!")
    print(f"Successfully generated: {success_count}/{len(images)} images")
    print(f"Output directory: {os.path.abspath(args.output)}")
    print("="*50)

if __name__ == "__main__":
    print("\n" + "="*50)
    print("Kids Coloring AI - Local Image Generator")
    print("="*50)
    print("This script generates coloring book style images using local Ollama models")
    print("Make sure Ollama is running and you have pulled the desired model")
    print("Example: ollama pull sdxl")
    print("="*50 + "\n")
    
    try:
        main()
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
        print("Make sure Ollama is running and the model is downloaded.")
        print("Run with --list-models to see available models.")
        print("Run 'ollama serve' in a separate terminal if not already running.")
