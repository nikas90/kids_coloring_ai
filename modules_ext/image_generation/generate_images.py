import os
import replicate
from pathlib import Path
import argparse
from tqdm import tqdm
import sys

# Import configuration
try:
    from config import REPLICATE_API_TOKEN
except ImportError:
    print("Error: config.py not found. Please create it with your REPLICATE_API_TOKEN")
    sys.exit(1)

# Set the API token
os.environ["REPLICATE_API_TOKEN"] = REPLICATE_API_TOKEN

# Default configuration
DEFAULT_INPUT_FILE = 'img_desc.txt'
DEFAULT_OUTPUT_DIR = 'generated_images'
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

def generate_image(prompt, output_path, width=800, height=1000, style_prompt=DEFAULT_STYLE):
    """Generate an image using Replicate's Stable Diffusion API."""
    try:
        # Add style prompts for consistent cartoon/coloring book style
        enhanced_prompt = f"{prompt}. {style_prompt}"
        
        print(f"\nGenerating: {os.path.basename(output_path)}")
        print(f"Prompt: {prompt}")
        
        # Run the model with a more stable version
        output = replicate.run(
            "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
            input={
                "prompt": enhanced_prompt,
                "width": width,
                "height": height,
                "num_outputs": 1,
                "negative_prompt": "text, watermark, signature, dark, blurry, shaded, grayscale, photo, realistic, complex, detailed",
                "num_inference_steps": 30,
                "guidance_scale": 7.5,
            }
        )
        
        # Download the generated image
        if output and len(output) > 0:
            import requests
            from io import BytesIO
            from PIL import Image
            
            response = requests.get(output[0], timeout=60)  # Increased timeout
            response.raise_for_status()
            
            img = Image.open(BytesIO(response.content))
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Convert to RGB if needed (for PNG with transparency)
            if img.mode != 'RGB':
                img = img.convert('RGB')
                
            img.save(output_path)
            print(f"✓ Saved: {output_path}")
            return True
            
    except Exception as e:
        print(f"✗ Error generating {os.path.basename(output_path)}: {str(e)}")
        print(f"Prompt used: {enhanced_prompt}")
    
    return False

def main():
    parser = argparse.ArgumentParser(description='Generate coloring book images from descriptions')
    parser.add_argument('--input', '-i', default=DEFAULT_INPUT_FILE,
                      help=f'Input file with image descriptions (default: {DEFAULT_INPUT_FILE})')
    parser.add_argument('--output', '-o', default=DEFAULT_OUTPUT_DIR,
                      help=f'Output directory for generated images (default: {DEFAULT_OUTPUT_DIR})')
    parser.add_argument('--width', type=int, default=800, help='Image width (default: 800)')
    parser.add_argument('--height', type=int, default=1000, help='Image height (default: 1000)')
    parser.add_argument('--skip-existing', action='store_true', help='Skip existing files')
    
    args = parser.parse_args()
    
    # Read image descriptions
    print(f"Reading image descriptions from: {args.input}")
    images = read_image_descriptions(args.input)
    
    if not images:
        print("No valid image descriptions found.")
        return
    
    print(f"Found {len(images)} images to generate")
    print(f"Output directory: {args.output}")
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
            width, height = (args.width, args.height)  # Use provided or default
            
        # Generate the image
        if generate_image(description, output_path, width, height):
            success_count += 1
    
    print("\n" + "="*50)
    print(f"Image generation complete!")
    print(f"Successfully generated: {success_count}/{len(images)} images")
    print(f"Output directory: {os.path.abspath(args.output)}")
    print("="*50)

if __name__ == "__main__":
    print("\n" + "="*50)
    print("Kids Coloring AI - Image Generator")
    print("="*50)
    print("This script generates coloring book style images using AI")
    print("Make sure you have set the REPLICATE_API_TOKEN in config.py")
    print("Get a free API key at: https://replicate.com/account/api-tokens")
    print("="*50 + "\n")
    
    if not os.getenv("REPLICATE_API_TOKEN"):
        print("Error: REPLICATE_API_TOKEN is not set in config.py")
        print("Please check your config.py file and try again")
    else:
        main()
