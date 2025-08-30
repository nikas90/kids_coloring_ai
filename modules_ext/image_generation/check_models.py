import ollama

def list_ollama_models():
    try:
        # List available models
        models = ollama.list()
        print("\nAvailable models:")
        for model in models.get('models', []):
            print(f"- {model['name']} (digest: {model['digest']})")
        
        # List available models in the library
        print("\nAvailable models in library:")
        library = ollama.list()
        if 'models' in library:
            for model in library['models']:
                print(f"- {model['name']} (digest: {model['digest']})")
        return True
    except Exception as e:
        print(f"Error: {e}")
        print("\nMake sure Ollama is running. Try running 'ollama serve' in a separate terminal.")
        return False

if __name__ == "__main__":
    print("Checking Ollama models...")
    list_ollama_models()
