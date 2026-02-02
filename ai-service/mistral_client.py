"""
Mistral API Client
Handles all communication with Mistral API
"""
import os
import json
import requests
from typing import Dict, Any, Optional

class MistralClient:
    def __init__(self):
        self.api_key = os.getenv('MISTRAL_API_KEY')
        self.api_url = "https://api.mistral.ai/v1/chat/completions"
        self.model = "mistral-small-latest"
        
        if not self.api_key:
            raise ValueError("MISTRAL_API_KEY environment variable not set")
    
    def call_mistral(self, system_prompt: str, user_message: str) -> Optional[Dict[str, Any]]:
        """
        Call Mistral API with system and user prompts
        Returns parsed JSON response or None if error
        """
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                "temperature": 0.7,
                "max_tokens": 1024
            }
            
            response = requests.post(self.api_url, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            
            # Extract message content
            if 'choices' in result and len(result['choices']) > 0:
                message_content = result['choices'][0]['message']['content']
                
                # Try to parse as JSON
                try:
                    return json.loads(message_content)
                except json.JSONDecodeError:
                    # If not JSON, try to extract JSON from text
                    import re
                    json_match = re.search(r'\{.*\}', message_content, re.DOTALL)
                    if json_match:
                        return json.loads(json_match.group())
                    else:
                        print(f"Could not parse response: {message_content}")
                        return None
            
            return None
            
        except requests.exceptions.RequestException as e:
            print(f"Mistral API Error: {str(e)}")
            return None
        except Exception as e:
            print(f"Unexpected error in Mistral call: {str(e)}")
            return None

# Initialize global client
mistral_client = MistralClient()
