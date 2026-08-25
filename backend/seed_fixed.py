"""
CyberAware - Fixed Database Seeder
Properly sequences inserts to avoid foreign key violations
"""

import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import create_app
from app.extensions import db
from app.models import TrainingModule, QuizQuestion, Scenario

app = create_app()

def seed_database():
    with app.app_context():
        print("🧹 Clearing all data...")
        
        # Delete in correct order
        QuizQuestion.query.delete()
        Scenario.query.delete()
        TrainingModule.query.delete()
        db.session.commit()
        print("✅ All data cleared")
        
        # Load seed data
        try:
            with open('seed_data.json', 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            print("❌ seed_data.json not found")
            return
        
        print("🌱 Seeding modules first...")
        
        # Seed modules first - commit immediately
        modules = data.get('modules', [])
        for module_data in modules:
            module = TrainingModule(**module_data)
            db.session.add(module)
        db.session.commit()
        print(f'✅ Seeded {len(modules)} modules')
        
        # Get valid module IDs
        module_ids = [m.id for m in TrainingModule.query.all()]
        print(f'📊 Valid module IDs: {len(module_ids)}')
        
        print("🌱 Seeding scenarios...")
        
        # Seed scenarios - filter to only valid module IDs
        scenarios = data.get('scenarios', [])
        valid_scenarios = []
        for scenario_data in scenarios:
            if scenario_data['module_id'] in module_ids:
                valid_scenarios.append(scenario_data)
            else:
                # Reassign to a random valid module
                scenario_data['module_id'] = random.choice(module_ids)
                valid_scenarios.append(scenario_data)
        
        for scenario_data in valid_scenarios:
            scenario = Scenario(**scenario_data)
            db.session.add(scenario)
        db.session.commit()
        print(f'✅ Seeded {len(valid_scenarios)} scenarios')
        
        print("🌱 Seeding quizzes...")
        
        # Seed quizzes
        quizzes = data.get('quizzes', [])
        valid_quizzes = []
        for quiz_data in quizzes:
            if quiz_data['module_id'] in module_ids:
                valid_quizzes.append(quiz_data)
            else:
                # Reassign to a random valid module
                quiz_data['module_id'] = random.choice(module_ids)
                valid_quizzes.append(quiz_data)
        
        for quiz_data in valid_quizzes:
            quiz = QuizQuestion(**quiz_data)
            db.session.add(quiz)
        db.session.commit()
        print(f'✅ Seeded {len(valid_quizzes)} quizzes')
        
        print("🎉 Database seeding complete!")
        print(f"📊 Final counts:")
        print(f"  Modules: {TrainingModule.query.count()}")
        print(f"  Scenarios: {Scenario.query.count()}")
        print(f"  Quizzes: {QuizQuestion.query.count()}")

if __name__ == "__main__":
    import random
    try:
        seed_database()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
