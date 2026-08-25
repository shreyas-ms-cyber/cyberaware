#!/usr/bin/env python3
"""
CyberAware - Seed Data Generator
Generates 150+ modules, 100+ scenarios, 100+ quizzes
"""

import json
import random
from datetime import datetime

# Define all topics with their modules
topics = {
    'password_security': {
        'name': 'Password & Credential Security',
        'icon': 'fa-key',
        'color': 'cyan',
        'modules': 15,
        'prefix': 'PWD'
    },
    'phishing_social': {
        'name': 'Phishing & Social Engineering',
        'icon': 'fa-fish',
        'color': 'red',
        'modules': 20,
        'prefix': 'PSE'
    },
    'mfa_identity': {
        'name': 'Multi-Factor Authentication',
        'icon': 'fa-shield-halved',
        'color': 'purple',
        'modules': 10,
        'prefix': 'MFA'
    },
    'malware_ransomware': {
        'name': 'Malware & Ransomware',
        'icon': 'fa-bug',
        'color': 'orange',
        'modules': 12,
        'prefix': 'MAL'
    },
    'safe_browsing': {
        'name': 'Safe Browsing & Web Security',
        'icon': 'fa-globe',
        'color': 'green',
        'modules': 10,
        'prefix': 'WEB'
    },
    'mobile_security': {
        'name': 'Mobile Device Security',
        'icon': 'fa-mobile-screen-button',
        'color': 'amber',
        'modules': 10,
        'prefix': 'MOB'
    },
    'email_security': {
        'name': 'Email Security',
        'icon': 'fa-envelope',
        'color': 'blue',
        'modules': 10,
        'prefix': 'EML'
    },
    'social_media_privacy': {
        'name': 'Social Media Privacy',
        'icon': 'fa-share-alt',
        'color': 'purple',
        'modules': 8,
        'prefix': 'SMP'
    },
    'physical_security': {
        'name': 'Physical Security',
        'icon': 'fa-building',
        'color': 'gray',
        'modules': 5,
        'prefix': 'PHY'
    },
    'data_privacy': {
        'name': 'Data Privacy & Compliance',
        'icon': 'fa-lock',
        'color': 'teal',
        'modules': 10,
        'prefix': 'DPR'
    },
    'remote_work': {
        'name': 'Remote Work Security',
        'icon': 'fa-laptop',
        'color': 'indigo',
        'modules': 10,
        'prefix': 'RWS'
    },
    'cloud_security': {
        'name': 'Cloud Security Basics',
        'icon': 'fa-cloud',
        'color': 'blue',
        'modules': 10,
        'prefix': 'CLD'
    },
    'iot_security': {
        'name': 'IoT & Smart Device Security',
        'icon': 'fa-microchip',
        'color': 'cyan',
        'modules': 5,
        'prefix': 'IOT'
    },
    'incident_response': {
        'name': 'Incident Reporting',
        'icon': 'fa-triangle-exclamation',
        'color': 'red',
        'modules': 5,
        'prefix': 'IRP'
    },
    'ai_deepfake': {
        'name': 'AI & Deepfake Threats',
        'icon': 'fa-robot',
        'color': 'purple',
        'modules': 8,
        'prefix': 'AID'
    },
    'business_email': {
        'name': 'Business Email Compromise',
        'icon': 'fa-briefcase',
        'color': 'orange',
        'modules': 5,
        'prefix': 'BEC'
    },
    'insider_threats': {
        'name': 'Insider Threats',
        'icon': 'fa-user-secret',
        'color': 'red',
        'modules': 5,
        'prefix': 'INS'
    },
    'public_wifi': {
        'name': 'Public Wi-Fi & VPN',
        'icon': 'fa-wifi',
        'color': 'amber',
        'modules': 8,
        'prefix': 'PWF'
    },
    'social_engineering': {
        'name': 'Social Engineering Deep Dive',
        'icon': 'fa-handshake',
        'color': 'red',
        'modules': 10,
        'prefix': 'SED'
    },
    'backup_recovery': {
        'name': 'Backup & Recovery',
        'icon': 'fa-cloud-upload-alt',
        'color': 'green',
        'modules': 8,
        'prefix': 'BRK'
    }
}

# Calculate totals
total_modules = sum(t['modules'] for t in topics.values())
print(f"📊 Generating {total_modules} modules...")

# Generate modules
modules = []
module_order = 1

for topic_key, topic in topics.items():
    for i in range(topic['modules']):
        module_num = i + 1
        modules.append({
            'title': f'{topic["name"]} - Module {module_num}',
            'module_order': module_order,
            'content_json': {
                'description': f'Learn about {topic["name"].lower()} essentials.',
                'learning_objectives': [
                    f'Understand key concepts in {topic["name"].lower()}',
                    'Apply security best practices',
                    'Recognize and respond to threats'
                ],
                'content': [
                    {
                        'type': 'text',
                        'title': f'Introduction to {topic["name"]}',
                        'body': f'This module covers essential concepts in {topic["name"].lower()}. Understanding these principles will help you stay secure.'
                    },
                    {
                        'type': 'text',
                        'title': 'Key Concepts',
                        'body': f'Learn the fundamental principles of {topic["name"].lower()} and how they apply to your daily work.'
                    },
                    {
                        'type': 'text',
                        'title': 'Best Practices',
                        'body': f'Implement these best practices to strengthen your security posture in {topic["name"].lower()}.'
                    }
                ],
                'real_world_example': {
                    'title': f'Real-World: {topic["name"]} Incident',
                    'description': f'Learn from a real-world example of {topic["name"].lower()} in action.'
                }
            }
        })
        module_order += 1

print(f'✅ Generated {len(modules)} modules')

# Generate scenarios (100+)
scenario_templates = [
    {
        'title': 'Phishing Email Detection',
        'description': 'You receive an email that appears to be from your bank asking to verify your account.',
        'options': [
            'Click the link to verify your account',
            'Ignore the email',
            'Call your bank directly using a known number',
            'Reply with your account details'
        ],
        'correct_answer': 'Call your bank directly using a known number',
        'explanation': 'This is likely a phishing attempt. Always verify through official channels.'
    },
    {
        'title': 'Suspicious USB Drive',
        'description': 'You find a USB drive in the parking lot labeled "Confidential - Employee Salaries".',
        'options': [
            'Plug it into your computer to see what\'s on it',
            'Turn it in to IT security',
            'Keep it for yourself',
            'Share it with colleagues'
        ],
        'correct_answer': 'Turn it in to IT security',
        'explanation': 'Never plug in unknown USB drives. They could contain malware.'
    },
    {
        'title': 'Tailgating at Office',
        'description': 'Someone without a badge follows you through the secure door, saying they forgot their badge.',
        'options': [
            'Let them in since they seem nice',
            'Ask them to wait and notify security',
            'Hold the door open for them',
            'Ignore them and walk away'
        ],
        'correct_answer': 'Ask them to wait and notify security',
        'explanation': 'Never allow unauthorized individuals to tailgate into secure areas.'
    },
    {
        'title': 'Social Media Phishing',
        'description': 'You receive a LinkedIn message from a recruiter asking for your personal email and phone number.',
        'options': [
            'Share your contact information',
            'Verify the recruiter\'s identity first',
            'Ignore the message completely',
            'Send them your resume directly'
        ],
        'correct_answer': 'Verify the recruiter\'s identity first',
        'explanation': 'Always verify before sharing personal information on social media.'
    },
    {
        'title': 'Ransomware Warning',
        'description': 'You see a popup saying your files are encrypted and you need to pay $500 to unlock them.',
        'options': [
            'Pay the ransom immediately',
            'Contact IT security and disconnect from network',
            'Ignore the popup',
            'Try to fix it yourself'
        ],
        'correct_answer': 'Contact IT security and disconnect from network',
        'explanation': 'Do not pay ransomware. Contact IT security immediately and disconnect.'
    },
    {
        'title': 'Public Wi-Fi Risk',
        'description': 'You\'re at a coffee shop and connect to the free Wi-Fi. A popup asks for your credit card to verify identity.',
        'options': [
            'Enter your credit card to get free Wi-Fi',
            'Use a VPN and avoid entering sensitive info',
            'Enter a fake credit card number',
            'Ignore the popup'
        ],
        'correct_answer': 'Use a VPN and avoid entering sensitive info',
        'explanation': 'Never enter sensitive information on public Wi-Fi without a VPN.'
    },
    {
        'title': 'Email Spoofing Detection',
        'description': 'You receive an email from "ceo@company.com" asking for a wire transfer urgently.',
        'options': [
            'Process the transfer immediately',
            'Call the CEO to verify the request',
            'Reply asking for more details',
            'Forward the email to finance'
        ],
        'correct_answer': 'Call the CEO to verify the request',
        'explanation': 'Always verify urgent financial requests through a different channel.'
    },
    {
        'title': 'Malicious Link Recognition',
        'description': 'You receive a text with a link claiming your package is delayed. The link looks suspicious.',
        'options': [
            'Click the link to track your package',
            'Copy the link to check it',
            'Go to the carrier\'s website directly',
            'Share the link with friends'
        ],
        'correct_answer': 'Go to the carrier\'s website directly',
        'explanation': 'Never click suspicious links. Always go to the official website directly.'
    },
    {
        'title': 'Password Manager Setup',
        'description': 'Your company introduces a password manager. You need to set it up but forget the master password.',
        'options': [
            'Write the master password on a sticky note',
            'Use the reset process to create a new one',
            'Share it with a colleague',
            'Store it in your email'
        ],
        'correct_answer': 'Use the reset process to create a new one',
        'explanation': 'Never write passwords down. Use the official reset process.'
    },
    {
        'title': 'Insider Threat Recognition',
        'description': 'You notice a colleague downloading large amounts of sensitive data to a personal USB drive.',
        'options': [
            'Confront them directly',
            'Report it to your manager or security team',
            'Ignore it',
            'Ask if they need help'
        ],
        'correct_answer': 'Report it to your manager or security team',
        'explanation': 'Report suspicious data activity to security. It could be an insider threat.'
    }
]

scenarios = []
for i in range(100):
    template = random.choice(scenario_templates)
    scenarios.append({
        'module_id': random.randint(1, len(modules)),
        'scenario_content': {
            'title': template['title'],
            'description': template['description']
        },
        'options_json': template['options'],
        'correct_answer': template['correct_answer'],
        'explanation': template['explanation']
    })

print(f'✅ Generated {len(scenarios)} scenarios')

# Generate quizzes (100+)
quizzes = []
quiz_questions = [
    "What is the first line of defense against unauthorized access?",
    "Which of the following is a strong password practice?",
    "What is social engineering?",
    "What does MFA stand for?",
    "What should you do if you receive a suspicious email?",
    "What is ransomware?",
    "What is a VPN used for?",
    "How often should you change your passwords?",
    "What is the purpose of a password manager?",
    "What is phishing?",
    "What is tailgating in physical security?",
    "What should you do with an unknown USB drive?",
    "What is a common sign of a phishing email?",
    "What is business email compromise?",
    "What is data privacy?",
    "Why is mobile security important?",
    "What is malware?",
    "What is social media privacy?",
    "What is cloud security?",
    "What are insider threats?"
]

difficulty_levels = ['beginner', 'intermediate', 'advanced']

for i in range(100):
    module_id = random.randint(1, len(modules))
    question = random.choice(quiz_questions)
    answers = [
        question + " - Correct approach",
        question + " - Incorrect approach 1",
        question + " - Incorrect approach 2",
        question + " - Incorrect approach 3"
    ]
    random.shuffle(answers)
    quizzes.append({
        'module_id': module_id,
        'question': question,
        'options_json': answers,
        'correct_answer': answers[0],
        'difficulty': random.choice(difficulty_levels)
    })

print(f'✅ Generated {len(quizzes)} quizzes')

# Save to JSON
with open('seed_data.json', 'w') as f:
    json.dump({
        'modules': modules,
        'scenarios': scenarios,
        'quizzes': quizzes
    }, f, indent=2)

print('✅ Seed data saved to seed_data.json')
print(f"📊 Summary:")
print(f"  ├─ Modules: {len(modules)}")
print(f"  ├─ Scenarios: {len(scenarios)}")
print(f"  └─ Quizzes: {len(quizzes)}")
