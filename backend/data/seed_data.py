import os
import sys
import pandas as pd
import random
import uuid

# Add the app directory to the path so we can import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal, engine, Base
from app.models.models import Entity, Relationship, Evidence, StateCrimeRecord

def seed_data():
    db = SessionLocal()
    
    # 1. Clear existing data
    print("Clearing existing data...")
    db.query(Relationship).delete()
    db.query(Entity).delete()
    db.query(Evidence).delete()
    db.query(StateCrimeRecord).delete()
    db.commit()

    # 2. Read the CSV file
    csv_path = "f:/jct/NCRB_Table_1A.1.csv"
    print(f"Reading CSV from {csv_path}")
    try:
        # Pandas handles universal newlines automatically
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    # Helper function to generate synthetic people
    synthetic_names = ["Victor K.", "Ghost Sec.", "Elena R.", "Marcus V.", "Sarah T.", "Operation Iceberg", "Offshore ACC", "Phantom Corp"]

    state_entities = {}
    person_entities = []

    print("Generating Graph Data from NCRB stats...")
    
    # We'll skip the rows that are totals like "Total State (S)"
    for index, row in df.iterrows():
        state_name = str(row['State/UT']).strip()
        
        if "Total" in state_name:
            continue
            
        try:
            crimes_2020 = int(row['2020'])
            crimes_2021 = int(row['2021'])
            crimes_2022 = int(row['2022'])
            pop = float(row['Mid-Year Projected Population (in Lakhs) (2022)'])
            rate = float(row['Rate of Cognizable Crimes (IPC) (2022)'])
            charge_rate = float(row['Chargesheeting Rate (2022)'])
        except ValueError:
            continue

        # Create State Crime Record
        record = StateCrimeRecord(
            state_name=state_name,
            crimes_2020=crimes_2020,
            crimes_2021=crimes_2021,
            crimes_2022=crimes_2022,
            population_2022_lakhs=pop,
            crime_rate_2022=rate,
            chargesheeting_rate_2022=charge_rate
        )
        db.add(record)
        
        # Create Entity node for the State
        state_entity = Entity(
            type="STATE",
            name=state_name,
            attributes={"crime_rate": rate, "population_lakhs": pop}
        )
        db.add(state_entity)
        state_entities[state_name] = state_entity
        
        # Generate 1-2 synthetic people/orgs for this state
        num_synthetic = random.randint(1, 2)
        for _ in range(num_synthetic):
            name = random.choice(synthetic_names) + f" ({state_name[:3]})"
            e_type = random.choice(["PERSON", "ORG", "ACCOUNT"])
            person = Entity(
                type=e_type,
                name=name,
                attributes={"risk_score": random.randint(50, 100)}
            )
            db.add(person)
            person_entities.append(person)
            
            # Link person to state
            rel = Relationship(
                source_id=person.id,
                target_id=state_entity.id,
                type="OPERATES_IN",
                attributes={"confidence": random.uniform(0.7, 0.99)}
            )
            db.add(rel)

    # Create random links between the synthetic people
    for _ in range(len(person_entities)):
        p1 = random.choice(person_entities)
        p2 = random.choice(person_entities)
        if p1.id != p2.id:
            rel = Relationship(
                source_id=p1.id,
                target_id=p2.id,
                type=random.choice(["COMMUNICATED", "TRANSFERRED", "ASSOCIATED"]),
                attributes={"needs_review": random.choice([True, False])}
            )
            db.add(rel)

    db.commit()
    print("Database seeded successfully with Option A & B!")
    db.close()

if __name__ == "__main__":
    seed_data()
