#!/bin/bash
# Setup script for project configuration

echo "Setting up project files..."

# Handle environment file
if [ -f "env.example" ]; then
    echo "Copying env.example to .env..."
    cp env.example .env
elif [ -f ".env.example" ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
else
    echo "Error: No environment example file found!"
    exit 1
fi

# Handle gitignore file  
if [ -f "gitignore" ]; then
    echo "Copying gitignore to .gitignore..."
    cp gitignore .gitignore
else
    echo "Warning: gitignore file not found."
fi

echo "Setup complete! Please edit .env and add your OpenAI API key."
