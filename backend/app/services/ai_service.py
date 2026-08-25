import os
import json
import requests
from app.config import Config

class AIService:
    def __init__(self):
        self.api_key = Config.GEMINI_API_KEY
        self.model = Config.GEMINI_MODEL
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
    
    def generate_chat_response(self, message, module_context="general", conversation_history=None):
        """Generate a chat response using Google Gemini API"""
        
        if not self.api_key:
            return {
                "success": False,
                "error": "API key not configured. Please set GEMINI_API_KEY in environment variables."
            }
        
        # System prompt with cybersecurity focus
        system_prompt = """You are CyberBuddy, a cybersecurity awareness assistant. Your role is to help users learn about cybersecurity in a friendly, educational way.

KEY RULES:
1. ONLY discuss cybersecurity awareness topics: phishing, passwords, MFA, email security, safe browsing, public Wi-Fi, malware, data protection, mobile security, incident reporting
2. NEVER provide instructions for: malware creation, credential theft, phishing campaigns, unauthorized access, system exploitation, evading security controls
3. For unrelated questions: Politely redirect to cybersecurity topics
4. Keep responses: Educational, friendly, clear, and practical
5. Use real-world examples when helpful
6. Always explain WHY something is a security risk"""

        if module_context and module_context != "general":
            system_prompt += f"\n\nCurrent module: {module_context}. Tailor your response to this topic."

        context = ""
        if conversation_history:
            for msg in conversation_history[-5:]:
                role = "User" if msg.get("role") == "user" else "Assistant"
                context += f"{role}: {msg.get('content')}\n"

        full_prompt = f"{system_prompt}\n\n{context}User: {message}\nAssistant:"

        try:
            response = requests.post(
                f"{self.base_url}/{self.model}:generateContent",
                params={"key": self.api_key},
                json={
                    "contents": [{
                        "parts": [{"text": full_prompt}]
                    }],
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 500,
                        "topP": 0.9
                    }
                },
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and len(data["candidates"]) > 0:
                    response_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    return {
                        "success": True,
                        "response": response_text
                    }
                else:
                    return {
                        "success": False,
                        "error": "No response from AI"
                    }
            else:
                return {
                    "success": False,
                    "error": f"API Error: {response.status_code} - {response.text}"
                }

        except requests.exceptions.Timeout:
            return {
                "success": False,
                "error": "Request timed out. Please try again."
            }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }

    def generate_quiz(self, topic, difficulty="intermediate", question_count=5):
        """Generate a quiz using Google Gemini API"""
        
        if not self.api_key:
            return {
                "success": False,
                "error": "API key not configured"
            }

        prompt = f"""Generate a {difficulty} level cybersecurity quiz about {topic} with exactly {question_count} questions.

IMPORTANT RULES:
1. Return ONLY valid JSON
2. Each question must have exactly 4 options
3. Include the correct answer as one of the options
4. Include a brief explanation for why the answer is correct
5. Make questions educational and practical

Output format (JSON only, no other text):
{{
    "questions": [
        {{
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option A",
            "explanation": "Explanation text"
        }}
    ]
}}"""

        try:
            response = requests.post(
                f"{self.base_url}/{self.model}:generateContent",
                params={"key": self.api_key},
                json={
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }],
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 2000,
                        "topP": 0.9
                    }
                },
                timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                if "candidates" in data and len(data["candidates"]) > 0:
                    content = data["candidates"][0]["content"]["parts"][0]["text"]
                    
                    try:
                        import re
                        json_match = re.search(r'\{[\s\S]*\}', content)
                        if json_match:
                            quiz_data = json.loads(json_match.group())
                            return {
                                "success": True,
                                "data": quiz_data.get("questions", [])
                            }
                        else:
                            return {
                                "success": False,
                                "error": "Invalid response format"
                            }
                    except json.JSONDecodeError:
                        return {
                            "success": False,
                            "error": "Failed to parse AI response"
                        }
                else:
                    return {
                        "success": False,
                        "error": "No response from AI"
                    }
            else:
                return {
                    "success": False,
                    "error": f"API Error: {response.status_code}"
                }

        except Exception as e:
            return {
                "success": False,
                "error": f"Error: {str(e)}"
            }
