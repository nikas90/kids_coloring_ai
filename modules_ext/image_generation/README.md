# Kids Coloring AI - Image Generation Module

This module generates coloring book style images using AI based on text descriptions.

## Features

- Generate high-quality, child-friendly coloring book images
- Support for different image dimensions based on usage (banners, icons, etc.)
- Skip existing images to save API credits
- Progress tracking and error handling

## Prerequisites

1. Python 3.8 or higher
2. Replicate API key (free tier available)

## Setup

1. Activate the virtual environment:
   ```bash
   # Windows
   .\venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Set your Replicate API token as an environment variable:
   ```bash
   # Windows
   set REPLICATE_API_TOKEN=your_token_here
   
   # macOS/Linux
   export REPLICATE_API_TOKEN=your_token_here
   ```

## Usage

1. Create an `img_desc.txt` file with your image descriptions (or use the default one):
   ```
   # Format: filename.jpg|Description of the image
   example.jpg|A happy sun with sunglasses
   ```

2. Run the image generator:
   ```bash
   python generate_images.py
   ```

### Command Line Options

```
python generate_images.py [OPTIONS]

Options:
  -i, --input FILE     Input file with image descriptions (default: img_desc.txt)
  -o, --output DIR     Output directory for generated images (default: generated_images)
  --width INT          Image width (default: 800)
  --height INT         Image height (default: 1000)
  --skip-existing      Skip existing files
  --help               Show this message and exit
```

### Example

```bash
# Generate images with custom dimensions
python generate_images.py --width 1000 --height 1000

# Specify custom input and output
python generate_images.py -i my_descriptions.txt -o my_images

# Skip existing images
python generate_images.py --skip-existing
```

## Notes

- The script will automatically create the output directory if it doesn't exist
- Images are generated one at a time to avoid rate limiting
- The free tier of Replicate has limitations on the number of API calls
- For best results, use clear and specific descriptions in the input file

## Troubleshooting

- **Missing API Token**: Make sure to set the REPLICATE_API_TOKEN environment variable
- **Image Quality**: If images don't look right, try modifying the description or the style prompt in the script
- **API Limits**: If you hit rate limits, wait a few minutes and try again

## License

This project is licensed under the MIT License.
