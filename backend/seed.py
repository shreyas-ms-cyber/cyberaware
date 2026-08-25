import os
import sys
# Add the current directory to path so we can import app.py
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import from the root app.py file
from main import create_app
from app.extensions import db
from app.models import TrainingModule, QuizQuestion, Scenario

app = create_app()

def seed_database():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        print("🌱 Seeding database with training modules...")
        
        # Module 1: Password Security
        module1 = TrainingModule(
            title="Password Security",
            module_order=1,
            content_json={
                "description": "Learn how to create and manage strong, secure passwords.",
                "learning_objectives": [
                    "Understand password strength factors",
                    "Learn to create memorable strong passwords",
                    "Recognize password reuse risks",
                    "Implement password management best practices"
                ],
                "content": [
                    {
                        "type": "text",
                        "title": "Why Password Security Matters",
                        "body": "Passwords are the first line of defense against unauthorized access. Weak passwords can be cracked in seconds, putting your accounts and data at risk."
                    },
                    {
                        "type": "text",
                        "title": "Characteristics of Strong Passwords",
                        "body": "A strong password should be: At least 12 characters long, use a mix of uppercase and lowercase letters, include numbers and special characters, and avoid common words or patterns."
                    },
                    {
                        "type": "text",
                        "title": "Password Managers",
                        "body": "Password managers generate and store complex passwords for all your accounts. They reduce the burden of remembering multiple passwords while increasing security."
                    }
                ],
                "real_world_example": {
                    "title": "The 2020 Credential Stuffing Attack",
                    "description": "In 2020, a major attack used passwords stolen from one service to access accounts on other services. Users who reused passwords had multiple accounts compromised."
                }
            }
        )
        db.session.add(module1)
        
        # Module 2: Phishing & Social Engineering
        module2 = TrainingModule(
            title="Phishing & Social Engineering",
            module_order=2,
            content_json={
                "description": "Identify and defend against phishing attacks and social engineering tactics.",
                "learning_objectives": [
                    "Recognize common phishing techniques",
                    "Identify social engineering red flags",
                    "Understand how attackers manipulate human psychology",
                    "Implement safe email practices"
                ],
                "content": [
                    {
                        "type": "text",
                        "title": "What is Phishing?",
                        "body": "Phishing is a cyber attack where criminals attempt to trick you into revealing sensitive information by posing as legitimate entities."
                    },
                    {
                        "type": "text",
                        "title": "Common Phishing Techniques",
                        "body": "Email spoofing, spear phishing, whaling, vishing (voice phishing), and smishing (SMS phishing) are all common techniques used by attackers."
                    },
                    {
                        "type": "text",
                        "title": "Red Flags",
                        "body": "Urgent language, unexpected attachments, spelling errors, suspicious sender addresses, and requests for sensitive information are all red flags."
                    }
                ],
                "real_world_example": {
                    "title": "The 2021 Business Email Compromise",
                    "description": "A sophisticated phishing campaign targeted executives, using deepfake voice technology to request wire transfers, resulting in millions in losses."
                }
            }
        )
        db.session.add(module2)
        
        # Module 3: Multi-Factor Authentication
        module3 = TrainingModule(
            title="Multi-Factor Authentication",
            module_order=3,
            content_json={
                "description": "Understand and implement multi-factor authentication to enhance account security.",
                "learning_objectives": [
                    "Understand what MFA is and why it matters",
                    "Learn about different MFA factors",
                    "Implement MFA on key accounts",
                    "Troubleshoot common MFA issues"
                ],
                "content": [
                    {
                        "type": "text",
                        "title": "What is MFA?",
                        "body": "Multi-Factor Authentication requires two or more verification factors to access an account, significantly reducing the risk of unauthorized access."
                    },
                    {
                        "type": "text",
                        "title": "The Three Factors",
                        "body": "Something you know (password), something you have (phone/security key), and something you are (biometrics). Using at least two provides strong security."
                    }
                ],
                "real_world_example": {
                    "title": "The 2022 Cloud Account Breach",
                    "description": "An organization experienced a breach despite having strong passwords. The breach was possible because MFA was not enabled on critical accounts."
                }
            }
        )
        db.session.add(module3)
        
        # Module 4: Email Security
        module4 = TrainingModule(
            title="Email Security",
            module_order=4,
            content_json={
                "description": "Secure your email communications and protect against email-based threats.",
                "learning_objectives": [
                    "Implement email security best practices",
                    "Recognize malicious emails",
                    "Secure email attachments",
                    "Encrypt sensitive communications"
                ],
                "content": [
                    {
                        "type": "text",
                        "title": "Email Security Best Practices",
                        "body": "Use secure email providers, enable two-factor authentication, be cautious with attachments, and never share sensitive information via email."
                    }
                ],
                "real_world_example": {
                    "title": "The 2021 Email Spoofing Attack",
                    "description": "Attackers spoofed a company's email domain to send fake invoices to vendors, resulting in unauthorized payments."
                }
            }
        )
        db.session.add(module4)
        
        # Module 5: Safe Browsing
        module5 = TrainingModule(
            title="Safe Browsing",
            module_order=5,
            content_json={
                "description": "Protect yourself while browsing the internet and avoid online threats.",
                "learning_objectives": [
                    "Identify secure websites",
                    "Protect against browser vulnerabilities",
                    "Manage browser extensions safely",
                    "Use privacy-enhancing tools"
                ],
                "content": [
                    {
                        "type": "text",
                        "title": "Safe Browsing Practices",
                        "body": "Look for HTTPS in the URL, avoid suspicious websites, keep your browser updated, and use ad-blockers and privacy extensions."
                    }
                ],
                "real_world_example": {
                    "title": "The 2022 Malvertising Campaign",
                    "description": "A major ad network was compromised, delivering malware through legitimate websites. Safe browsing practices helped many users avoid infection."
                }
            }
        )
        db.session.add(module5)
        
        # Module 6: Public Wi-Fi
        module6 = TrainingModule(
            title="Public Wi-Fi Security",
            module_order=6,
            content_json={
                "description": "Learn to safely use public Wi-Fi and protect your data when away from home.",
                "learning_objectives": [
                    "Understand public Wi-Fi risks",
                    "Use VPNs effectively",
                    "Implement safe practices on public networks",
                    "Avoid hotspot honeypots"
                ],
                "content": [
                    {
                        "type": "text",
                        "title": "Public Wi-Fi Risks",
                        "body": "Man-in-the-middle attacks, evil twin hotspots, and unencrypted data transmission are common risks on public networks."
                    }
                ],
                "real_world_example": {
                    "title": "The 2022 Airport Wi-Fi Attack",
                    "description": "Attackers set up a fake Wi-Fi network at a major airport, capturing credentials and personal data from unsuspecting travelers."
                }
            }
        )
        db.session.add(module6)
        
        # Module 7: Malware & Ransomware
        module7 = TrainingModule(
            title="Malware & Ransomware",
            module_order=7,
            content_json={
                "description": "Understand and defend against malware and ransomware threats.",
                "learning_objectives": [
                    "Identify different types of malware",
                    "Recognize ransomware attacks",
                    "Implement prevention measures",
                    "Respond to incidents"
                ],
                "content": [
                    {
                        "type": "text",
                        "title": "Understanding Malware",
                        "body": "Malware includes viruses, worms, trojans, ransomware, and spyware. Each type has different infection methods and impacts."
                    }
                ],
                "real_world_example": {
                    "title": "The 2023 Healthcare Ransomware Attack",
                    "description": "A ransomware attack encrypted critical patient data, demanding payment. The attack disrupted operations and compromised patient care."
                }
            }
        )
        db.session.add(module7)
        
        # Module 8: Data Protection
        module8 = TrainingModule(
            title="Data Protection",
            module_order=8,
            content_json={
                "description": "Protect sensitive data and comply with privacy regulations.",
                "learning_objectives": [
                    "Classify sensitive data",
                    "Implement encryption",
                    "Follow data protection regulations",
                    "Secure data disposal"
                ],
                "content": [
                    {
                        "type": "text",
                        "title": "Data Protection Principles",
                        "body": "Data minimization, encryption, access control, and secure disposal are key principles of data protection."
                    }
                ],
                "real_world_example": {
                    "title": "The 2021 Data Protection Breach",
                    "description": "A company exposed sensitive customer data due to improper data classification and encryption. The breach resulted in significant fines."
                }
            }
        )
        db.session.add(module8)
        
        # Module 9: Mobile Security
        module9 = TrainingModule(
            title="Mobile Security",
            module_order=9,
            content_json={
                "description": "Secure your mobile devices and protect your personal data.",
                "learning_objectives": [
                    "Secure mobile device settings",
                    "Manage app permissions",
                    "Avoid mobile threats",
                    "Use mobile antivirus"
                ],
                "content": [
                    {
                        "type": "text",
                        "title": "Mobile Security Best Practices",
                        "body": "Use biometric authentication, keep your OS updated, download apps from official stores, and be cautious with app permissions."
                    }
                ],
                "real_world_example": {
                    "title": "The 2022 Mobile Banking Malware",
                    "description": "A mobile banking trojan disguised as a legitimate app stole banking credentials and PINs from thousands of users."
                }
            }
        )
        db.session.add(module9)
        
        # Module 10: Incident Reporting
        module10 = TrainingModule(
            title="Incident Reporting",
            module_order=10,
            content_json={
                "description": "Learn how to properly report cybersecurity incidents.",
                "learning_objectives": [
                    "Identify security incidents",
                    "Follow reporting procedures",
                    "Document incidents properly",
                    "Communicate effectively"
                ],
                "content": [
                    {
                        "type": "text",
                        "title": "Incident Reporting Best Practices",
                        "body": "Report incidents immediately, document all details, follow company protocols, and maintain clear communication with stakeholders."
                    }
                ],
                "real_world_example": {
                    "title": "The 2021 Incident Response Success",
                    "description": "A security team successfully contained a data breach because an employee promptly reported a suspicious email, enabling immediate incident response."
                }
            }
        )
        db.session.add(module10)
        
        db.session.commit()
        print("✅ Modules seeded successfully!")
        
        # Seed Quiz Questions
        print("🌱 Seeding quiz questions...")
        
        # Quiz for Module 1: Password Security
        quiz1 = [
            {
                "question": "What is the minimum recommended length for a strong password?",
                "options": ["6 characters", "8 characters", "12 characters", "16 characters"],
                "correct_answer": "12 characters",
                "difficulty": "beginner"
            },
            {
                "question": "Which of the following is an example of a strong password?",
                "options": ["password123", "B3stP@ssw0rd!", "12345678", "qwerty"],
                "correct_answer": "B3stP@ssw0rd!",
                "difficulty": "beginner"
            },
            {
                "question": "What is password reuse?",
                "options": [
                    "Using the same password for multiple accounts",
                    "Using a password manager",
                    "Changing passwords monthly",
                    "Using only numbers"
                ],
                "correct_answer": "Using the same password for multiple accounts",
                "difficulty": "intermediate"
            },
            {
                "question": "Which of the following is NOT a recommended password practice?",
                "options": [
                    "Using a password manager",
                    "Using personal information in passwords",
                    "Using long passphrases",
                    "Enabling two-factor authentication"
                ],
                "correct_answer": "Using personal information in passwords",
                "difficulty": "intermediate"
            },
            {
                "question": "How often should you change your passwords?",
                "options": [
                    "Monthly",
                    "Quarterly",
                    "When a breach occurs or periodically if using a manager",
                    "Never"
                ],
                "correct_answer": "When a breach occurs or periodically if using a manager",
                "difficulty": "intermediate"
            }
        ]
        
        # Quiz for Module 2: Phishing
        quiz2 = [
            {
                "question": "What is phishing?",
                "options": [
                    "An attack that tricks users into revealing sensitive information",
                    "A type of computer virus",
                    "A hardware failure",
                    "A network configuration error"
                ],
                "correct_answer": "An attack that tricks users into revealing sensitive information",
                "difficulty": "beginner"
            },
            {
                "question": "Which of the following is a red flag for a phishing email?",
                "options": [
                    "Spelling and grammar errors",
                    "Your name in the greeting",
                    "A signature with contact information",
                    "Professional formatting"
                ],
                "correct_answer": "Spelling and grammar errors",
                "difficulty": "beginner"
            },
            {
                "question": "What is spear phishing?",
                "options": [
                    "A targeted phishing attack against a specific person or organization",
                    "A mass email campaign",
                    "A type of firewall",
                    "A password security tool"
                ],
                "correct_answer": "A targeted phishing attack against a specific person or organization",
                "difficulty": "intermediate"
            },
            {
                "question": "What should you do if you receive a suspicious email?",
                "options": [
                    "Click the link to verify",
                    "Reply asking for more information",
                    "Report it to your security team and delete it",
                    "Forward it to all your colleagues"
                ],
                "correct_answer": "Report it to your security team and delete it",
                "difficulty": "intermediate"
            },
            {
                "question": "What is social engineering?",
                "options": [
                    "The use of psychological manipulation to trick people into revealing information",
                    "A type of engineering degree",
                    "A social media platform",
                    "An email security tool"
                ],
                "correct_answer": "The use of psychological manipulation to trick people into revealing information",
                "difficulty": "intermediate"
            }
        ]
        
        # Quiz for Module 3: MFA
        quiz3 = [
            {
                "question": "What does MFA stand for?",
                "options": [
                    "Multi-Factor Authentication",
                    "Main Frame Access",
                    "Mobile File Access",
                    "Master File Authentication"
                ],
                "correct_answer": "Multi-Factor Authentication",
                "difficulty": "beginner"
            },
            {
                "question": "Which of these is NOT a factor in MFA?",
                "options": [
                    "Something you know",
                    "Something you have",
                    "Something you are",
                    "Something you bought"
                ],
                "correct_answer": "Something you bought",
                "difficulty": "beginner"
            },
            {
                "question": "What is an example of 'something you have'?",
                "options": [
                    "A password",
                    "A phone with OTP app",
                    "A birthday",
                    "A pet's name"
                ],
                "correct_answer": "A phone with OTP app",
                "difficulty": "beginner"
            },
            {
                "question": "Why is MFA considered more secure than just a password?",
                "options": [
                    "Because it requires multiple forms of verification",
                    "Because it's harder to type",
                    "Because it takes more time",
                    "Because it's newer technology"
                ],
                "correct_answer": "Because it requires multiple forms of verification",
                "difficulty": "intermediate"
            },
            {
                "question": "What is the most common factor used in MFA?",
                "options": [
                    "Fingerprint scan",
                    "Security questions",
                    "Time-based one-time password (TOTP)",
                    "Voice recognition"
                ],
                "correct_answer": "Time-based one-time password (TOTP)",
                "difficulty": "intermediate"
            }
        ]
        
        # Seed all quiz questions
        all_quizzes = [quiz1, quiz2, quiz3]
        module_ids = list(range(1, 4))
        
        for module_id, quiz_data in zip(module_ids, all_quizzes):
            for q in quiz_data:
                question = QuizQuestion(
                    module_id=module_id,
                    question=q['question'],
                    options_json=q['options'],
                    correct_answer=q['correct_answer'],
                    difficulty=q['difficulty']
                )
                db.session.add(question)
        
        db.session.commit()
        print("✅ Quiz questions seeded successfully!")
        
        # Seed Scenarios
        print("🌱 Seeding scenarios...")
        
        scenarios = [
            {
                "module_id": 1,
                "scenario_content": {
                    "title": "Password Reset Scam",
                    "description": "You receive an email from a service claiming your password has expired and you need to reset it immediately. The email includes a link to a website that looks legitimate but has a slightly different URL."
                },
                "options": [
                    "Click the link and reset your password",
                    "Ignore the email",
                    "Go directly to the service's website and reset your password there",
                    "Forward the email to your friends"
                ],
                "correct_answer": "Go directly to the service's website and reset your password there",
                "explanation": "This is a phishing attempt. Always navigate to the service's official website directly, never click links in suspicious emails."
            },
            {
                "module_id": 2,
                "scenario_content": {
                    "title": "Urgent Email from CEO",
                    "description": "You receive an email from your CEO asking you to send the company's employee list and sensitive payroll data immediately. The email is urgent and says it's for an important audit."
                },
                "options": [
                    "Send the data immediately as requested",
                    "Reply asking for a document request form",
                    "Verify the request through a different channel like a phone call",
                    "Forward the email to all employees"
                ],
                "correct_answer": "Verify the request through a different channel like a phone call",
                "explanation": "This is likely a CEO fraud or spear phishing attempt. Always verify sensitive data requests through official channels, especially when they're urgent."
            },
            {
                "module_id": 2,
                "scenario_content": {
                    "title": "Unexpected Package Delivery",
                    "description": "You receive a text message claiming a package is delayed and you need to confirm your address by clicking a link. You don't remember ordering anything recently."
                },
                "options": [
                    "Click the link and confirm your address",
                    "Ignore the message",
                    "Check your recent orders directly on the carrier's official app",
                    "Reply with your address"
                ],
                "correct_answer": "Check your recent orders directly on the carrier's official app",
                "explanation": "This is a smishing (SMS phishing) attack. Always verify package deliveries through official channels, not through unsolicited text messages."
            },
            {
                "module_id": 3,
                "scenario_content": {
                    "title": "MFA Setup Assistant",
                    "description": "You receive a call from someone claiming to be from your company's IT support. They say they need to help you set up MFA and request your phone number and the authentication code sent to you."
                },
                "options": [
                    "Provide your phone number and the code",
                    "Hang up and contact IT support through the official number",
                    "Ask them to verify your identity first",
                    "Provide only your phone number"
                ],
                "correct_answer": "Hang up and contact IT support through the official number",
                "explanation": "This is a social engineering attack. Never share authentication codes over the phone. Always initiate contact with IT support through official channels."
            },
            # Additional Scenarios - Module 4
            {
                "module_id": 4,
                "scenario_content": {
                    "title": "Suspicious Email Attachment",
                    "description": "You receive an email from an unknown sender with an attachment titled 'Invoice_2024.zip'. The email says the invoice is overdue and needs immediate payment."
                },
                "options": [
                    "Open the attachment to check the invoice",
                    "Delete the email immediately",
                    "Scan the attachment with antivirus before opening",
                    "Forward it to your IT security team"
                ],
                "correct_answer": "Forward it to your IT security team",
                "explanation": "Never open attachments from unknown senders. Forward suspicious emails to your IT security team for investigation."
            },
            # Additional Scenarios - Module 5
            {
                "module_id": 5,
                "scenario_content": {
                    "title": "Suspicious Website Popup",
                    "description": "While browsing a news website, a popup appears saying 'Your computer is infected! Call this number immediately for help.'"
                },
                "options": [
                    "Call the number for help",
                    "Close the popup and ignore it",
                    "Click the popup to see more details",
                    "Download the antivirus software they recommend"
                ],
                "correct_answer": "Close the popup and ignore it",
                "explanation": "This is a common scareware tactic. Legitimate antivirus software never uses popup ads to alert you of infections."
            },
            # Additional Scenarios - Module 6
            {
                "module_id": 6,
                "scenario_content": {
                    "title": "Free Airport Wi-Fi",
                    "description": "You're at the airport and see two Wi-Fi networks: 'Airport_Free_WiFi' and 'Airport_Secure_WiFi'. Both are open networks."
                },
                "options": [
                    "Connect to 'Airport_Free_WiFi'",
                    "Connect to 'Airport_Secure_WiFi'",
                    "Use a VPN before connecting to any Wi-Fi",
                    "Don't use public Wi-Fi at all"
                ],
                "correct_answer": "Use a VPN before connecting to any Wi-Fi",
                "explanation": "Always use a VPN on public Wi-Fi to encrypt your traffic. Be cautious of fake networks that may be set up by attackers."
            }
        ]
        
        for scenario_data in scenarios:
            scenario = Scenario(
                module_id=scenario_data['module_id'],
                scenario_content=scenario_data['scenario_content'],
                options_json=scenario_data['options'],
                correct_answer=scenario_data['correct_answer'],
                explanation=scenario_data['explanation']
            )
            db.session.add(scenario)
        
        db.session.commit()
        print("✅ Scenarios seeded successfully!")
        print("🎉 Database seeding complete!")

if __name__ == '__main__':
    try:
        seed_database()
        print("\n✅ Database setup completed successfully!")
    except Exception as e:
        print(f"\n❌ Error seeding database: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
