"""
CyberAware - Complete Database Seeder
Seeds 150+ modules, 100+ scenarios, 100+ quizzes
Idempotent and chunked for performance
"""

import json
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import create_app
from app.extensions import db
from app.models import TrainingModule, QuizQuestion, Scenario

app = create_app()

def seed_database():
    with app.app_context():
        print("🌱 Starting complete database seed...")
        
        # Load seed data
        try:
            with open('seed_data.json', 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            print("❌ seed_data.json not found. Run the generator first.")
            return
        
        # Check if data already exists
        existing_count = TrainingModule.query.count()
        if existing_count > 0:
            print(f"⚠️ Database already has {existing_count} modules")
            print("⏭️ Skipping seed to avoid duplicates")
            return
        
        # Seed modules in chunks
        modules = data.get('modules', [])
        total_modules = len(modules)
        print(f"📚 Seeding {total_modules} modules...")
        
        chunk_size = 50
        for i in range(0, total_modules, chunk_size):
            chunk = modules[i:i+chunk_size]
            for module_data in chunk:
                module = TrainingModule(**module_data)
                db.session.add(module)
            db.session.commit()
            progress = min(i + chunk_size, total_modules)
            print(f"  ✅ Seeded {progress}/{total_modules} modules")
        
        # Seed scenarios
        scenarios = data.get('scenarios', [])
        total_scenarios = len(scenarios)
        print(f"🛡️ Seeding {total_scenarios} scenarios...")
        
        for i, scenario_data in enumerate(scenarios):
            scenario = Scenario(**scenario_data)
            db.session.add(scenario)
            if (i + 1) % 50 == 0:
                db.session.commit()
                print(f"  ✅ Seeded {i+1}/{total_scenarios} scenarios")
        db.session.commit()
        print(f"  ✅ Seeded {total_scenarios}/{total_scenarios} scenarios")
        
        # Seed quizzes
        quizzes = data.get('quizzes', [])
        total_quizzes = len(quizzes)
        print(f"❓ Seeding {total_quizzes} quizzes...")
        
        for i, quiz_data in enumerate(quizzes):
            quiz = QuizQuestion(**quiz_data)
            db.session.add(quiz)
            if (i + 1) % 50 == 0:
                db.session.commit()
                print(f"  ✅ Seeded {i+1}/{total_quizzes} quizzes")
        db.session.commit()
        print(f"  ✅ Seeded {total_quizzes}/{total_quizzes} quizzes")
        
        print("🎉 Database seeding complete!")
        print(f"📊 Final counts:")
        print(f"  ├─ Modules: {TrainingModule.query.count()}")
        print(f"  ├─ Scenarios: {Scenario.query.count()}")
        print(f"  └─ Quizzes: {QuizQuestion.query.count()}")

if __name__ == "__main__":
    try:
        seed_database()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
