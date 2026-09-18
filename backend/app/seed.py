"""
Chennai-Centric Forensic Seed Script: Tamil Nadu Cyber Crime Wing — Chennai Command.
Populates Chennai-based cases, entities, relationships, evidence records, timeline events, audit logs, AND vector store embeddings.

Run with: python -m app.seed
"""
from datetime import datetime, timedelta, timezone

from app.database import SessionLocal, engine, Base
from app.models.models import (
    User, Case, CaseAssignment, Entity, Relationship, 
    Source, Evidence, Event, AuditLog
)
from app.utils.security import hash_password
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        print("Clearing existing database records for Chennai re-seed...")
        db.query(AuditLog).delete()
        db.query(Event).delete()
        db.query(Evidence).delete()
        db.query(Relationship).delete()
        db.query(Entity).delete()
        db.query(Source).delete()
        db.query(CaseAssignment).delete()
        db.query(Case).delete()
        db.query(User).delete()
        db.commit()

        # ─── 1. Seed Users (Chennai Command) ───
        print("Seeding Chennai Cyber Crime Wing Officers...")
        users_data = [
            ("ADGP Cyber Crime Chennai", "admin@networkhunter.io", "SUPER_ADMIN", "TN Police Headquarters, Chennai", "password123"),
            ("DSP Karthik Raja", "invadmin@networkhunter.io", "INVESTIGATION_ADMIN", "Chennai Cyber Crime Cell", "password123"),
            ("Inspector Anbarasu", "investigator@networkhunter.io", "INVESTIGATOR", "OMR IT Corridor Unit", "password123"),
            ("Analyst Divya Priya", "analyst@networkhunter.io", "ANALYST", "Forensic Data Intelligence, Guindy", "password123"),
            ("Legal Officer Sundaram", "reviewer@networkhunter.io", "EVIDENCE_REVIEWER", "Chennai High Court Liaison", "password123"),
            ("Inspector General Audit", "viewer@networkhunter.io", "VIEWER", "Home Department Tamil Nadu", "password123"),
        ]

        seeded_users = {}
        for name, email, role, dept, password in users_data:
            u = User(
                full_name=name,
                email=email,
                password_hash=hash_password(password),
                role=role,
                department=dept,
                organization="Tamil Nadu Cyber Crime Wing — Chennai",
            )
            db.add(u)
            db.flush()
            seeded_users[role] = u

        db.commit()

        # ─── 2. Seed Cases (Chennai Based) ───
        print("Seeding Chennai investigation cases...")
        cases_data = [
            {
                "case_name": "Operation Marina Net",
                "description": "Undercover investigation into an international cyber extortion & hawala laundering ring operating out of OMR IT Corridor & Parrys Corner, Chennai.",
                "status": "ACTIVE",
                "creator": seeded_users["SUPER_ADMIN"].id
            },
            {
                "case_name": "Anna Salai Hawala Probe",
                "description": "Illicit financial network laundering syndicate routing fraudulent funds through shell bank accounts across Mount Road & Nungambakkam branches.",
                "status": "UNDER_REVIEW",
                "creator": seeded_users["INVESTIGATION_ADMIN"].id
            },
            {
                "case_name": "ECR Crypto Phishing Syndicate",
                "description": "Targeted investigation into fake IT recruitment & crypto wallet draining racket operating from Neelankarai & Sholinganallur.",
                "status": "ACTIVE",
                "creator": seeded_users["INVESTIGATOR"].id
            },
            {
                "case_name": "Chennai Port SIM Box Intrusion",
                "description": "Unauthorized cellular frequency hijacking & illegal VoIP call termination near Chennai Port Trust & Royapuram.",
                "status": "CLOSED",
                "creator": seeded_users["SUPER_ADMIN"].id
            }
        ]

        seeded_cases = []
        for c in cases_data:
            c_obj = Case(
                case_name=c["case_name"],
                description=c["description"],
                status=c["status"],
                created_by=c["creator"]
            )
            db.add(c_obj)
            db.flush()
            seeded_cases.append(c_obj)

        db.commit()

        case_marina = seeded_cases[0]
        case_annasalai = seeded_cases[1]
        case_ecr = seeded_cases[2]

        # ─── 3. Seed Entities (Chennai Context) ───
        print("Seeding Chennai target entities...")
        entities_list = [
            # Case 1: Operation Marina Net
            {"case": case_marina, "type": "Person", "name": "Rajan @ 'Shadow' Kumar", "status": "FLAGGED", "attr": {"alias": "ShadowRajan", "location": "Taramani, Chennai"}},
            {"case": case_marina, "type": "Phone", "name": "+91 98401 22910", "status": "VERIFIED", "attr": {"carrier": "Airtel Chennai", "circle": "Tamil Nadu"}},
            {"case": case_marina, "type": "Location", "name": "OMR Tech Park, Taramani, Chennai", "status": "VERIFIED", "attr": {"pincode": "600113"}},
            {"case": case_marina, "type": "Organization", "name": "Bayfront Tech Solutions Pvt Ltd", "status": "FLAGGED", "attr": {"reg_office": "Parrys Corner, Chennai - 600001"}},
            {"case": case_marina, "type": "Account", "name": "SBI Mount Road A/C 3091829301", "status": "OBSERVED", "attr": {"branch": "Anna Salai Main Branch"}},

            # Case 2: Anna Salai Hawala Probe
            {"case": case_annasalai, "type": "Person", "name": "Priya Ramanathan", "status": "OBSERVED", "attr": {"residence": "Nungambakkam, Chennai"}},
            {"case": case_annasalai, "type": "Phone", "name": "+91 98410 88201", "status": "VERIFIED", "attr": {"carrier": "Jio Tamil Nadu"}},
            {"case": case_annasalai, "type": "Account", "name": "HDFC Nungambakkam A/C 501002349", "status": "FLAGGED", "attr": {"ifsc": "HDFC0000082"}},

            # Case 3: ECR Crypto Phishing Syndicate
            {"case": case_ecr, "type": "Person", "name": "Kavitha Selvam", "status": "INFERRED", "attr": {"location": "ECR Neelankarai, Chennai"}},
            {"case": case_ecr, "type": "CryptoWallet", "name": "0xTN77...44A2 (WazirX / USDT)", "status": "FLAGGED", "attr": {"exchange": "WazirX India", "amount_inr": "₹1.45 Crores"}},
        ]

        seeded_entities = []
        for e in entities_list:
            ent = Entity(
                case_id=e["case"].id,
                type=e["type"],
                name=e["name"],
                status=e["status"],
                attributes=e["attr"]
            )
            db.add(ent)
            db.flush()
            seeded_entities.append(ent)

        db.commit()

        # ─── 4. Seed Relationships ───
        print("Seeding Chennai crime network relationships...")
        rels_data = [
            (seeded_entities[0], seeded_entities[1], "OPERATES_PHONE", "VERIFIED", {"city": "Chennai"}),
            (seeded_entities[0], seeded_entities[3], "MANAGING_DIRECTOR", "FLAGGED", {"office": "Parrys Corner"}),
            (seeded_entities[1], seeded_entities[2], "TOWER_PING", "VERIFIED", {"tower": "Taramani OMR Cell Tower #4"}),
            (seeded_entities[3], seeded_entities[4], "BANK_ACCOUNT_HOLDER", "OBSERVED", {"branch": "SBI Mount Road"}),
            (seeded_entities[5], seeded_entities[6], "REGISTERED_MOBILE", "VERIFIED", {"circle": "Chennai"}),
            (seeded_entities[6], seeded_entities[7], "UPI_TRANSFER", "FLAGGED", {"amount": "₹4,50,000"}),
            (seeded_entities[8], seeded_entities[9], "CRYPTO_CASHOUT", "FLAGGED", {"exchange": "WazirX India"}),
        ]

        for src_ent, tgt_ent, rel_type, rel_status, attr in rels_data:
            r = Relationship(
                source_entity_id=src_ent.id,
                target_entity_id=tgt_ent.id,
                type=rel_type,
                status=rel_status,
                attributes=attr
            )
            db.add(r)

        db.commit()

        # ─── 5. Seed Sources & Evidence ───
        print("Seeding Chennai evidence source files & records...")
        source_call = Source(
            case_id=case_marina.id,
            filename="chennai_tower_intercepts.csv",
            row_count=25,
            columns=["timestamp", "caller_number", "receiver_number", "tower_location", "duration"],
            uploaded_by=seeded_users["INVESTIGATOR"].id
        )
        source_bank = Source(
            case_id=case_marina.id,
            filename="sbi_mount_road_ledger.csv",
            row_count=18,
            columns=["tx_id", "from_account", "to_account", "amount_inr", "timestamp"],
            uploaded_by=seeded_users["INVESTIGATOR"].id
        )
        db.add(source_call)
        db.add(source_bank)
        db.flush()

        evidence_rows = [
            {
                "case": case_marina,
                "source": source_call,
                "type": "TOWER_INTERCEPT",
                "content": "Rajan @ 'Shadow' Kumar (+91 98401 22910) logged 18 encrypted calls near Taramani OMR Tech Park cell tower connecting to Bayfront Tech Solutions Parrys Corner office on 2026-09-15 08:42:11.",
                "row_num": 101,
                "status": "VERIFIED",
                "reviewer": seeded_users["EVIDENCE_REVIEWER"].id,
                "comment": "Verified with Airtel Chennai CDR logs."
            },
            {
                "case": case_marina,
                "source": source_bank,
                "type": "RTGS_TRANSFER",
                "content": "Wire transfer of ₹1,45,00,000 (₹1.45 Crores) from SBI Mount Road A/C 3091829301 to WazirX Crypto Exchange account 0xTN77...44A2 on 2026-09-15 09:15:00.",
                "row_num": 102,
                "status": "FLAGGED",
                "reviewer": seeded_users["EVIDENCE_REVIEWER"].id,
                "comment": "Flagged by FIU-IND for high value hawala laundering."
            },
            {
                "case": case_annasalai,
                "source": None,
                "type": "UPI_FRAUD_LOG",
                "content": "Multiple fraudulent UPI transfers originating from Nungambakkam mobile subscriber Priya Ramanathan (+91 98410 88201) into HDFC Bank Nungambakkam Branch on 2026-09-16 14:20:00.",
                "row_num": 103,
                "status": "OBSERVED",
                "reviewer": None,
                "comment": ""
            },
            {
                "case": case_ecr,
                "source": None,
                "type": "PHISHING_URL_LOG",
                "content": "ECR Cyber Syndicate fake job portal hosted on rogue server IP 103.21.244.18 targeted 140 IT employees in Sholinganallur & Siruseri IT Park.",
                "row_num": 104,
                "status": "INFERRED",
                "reviewer": None,
                "comment": ""
            }
        ]

        vector_ids = []
        vector_docs = []
        vector_embeds = []
        vector_metas = []

        for idx, ev_data in enumerate(evidence_rows):
            ev = Evidence(
                case_id=ev_data["case"].id,
                source_id=ev_data["source"].id if ev_data["source"] else None,
                type=ev_data["type"],
                content=ev_data["content"],
                row_number=ev_data["row_num"],
                status=ev_data["status"],
                reviewed_by=ev_data["reviewer"],
                review_comment=ev_data["comment"],
                reviewed_at=datetime.now(timezone.utc) if ev_data["reviewer"] else None
            )
            db.add(ev)
            db.flush()

            # Vector store document for Hacker AI RAG
            doc_text = f"Case: {ev_data['case'].case_name} | Chennai Evidence: {ev_data['content']}"
            embed = embedding_service.get_embedding(doc_text)
            
            vector_ids.append(ev.id)
            vector_docs.append(doc_text)
            vector_embeds.append(embed)
            vector_metas.append({
                "case_id": ev_data["case"].id,
                "filename": ev_data["source"].filename if ev_data["source"] else "chennai_cyber_ledger",
                "row_id": str(ev_data["row_num"])
            })

        db.commit()

        # Add to vector store for Hacker AI RAG
        print("Vectorizing Chennai evidence into ChromaDB for Hacker AI...")
        vector_store.add_documents(
            ids=vector_ids,
            documents=vector_docs,
            embeddings=vector_embeds,
            metadatas=vector_metas
        )

        # ─── 6. Seed Timeline Events ───
        print("Seeding Chennai timeline events...")
        now = datetime.now(timezone.utc)
        events_data = [
            (case_marina, "TOWER_INTERCEPT", "Cellular intercept logged between Taramani OMR Tech Park and Parrys Corner shell office.", now - timedelta(days=3, hours=4), "VERIFIED"),
            (case_marina, "HAWALA_TRANSFER", "High-value RTGS transfer of ₹1.45 Crores debited from SBI Mount Road branch.", now - timedelta(days=3, hours=2), "FLAGGED"),
            (case_annasalai, "LOCATION_PING", "Suspect mobile device ping registered near Nungambakkam High Road.", now - timedelta(days=2, hours=1), "OBSERVED"),
            (case_ecr, "PHISHING_ALERT", "Rogue domain 'chennai-it-jobs.org' reported by Cyber Crime Police Station Sholinganallur.", now - timedelta(days=1, hours=5), "INFERRED"),
            (case_marina, "CYBER_ALERT", "Automated alert issued by TN Cyber Crime Wing forensic monitoring engine.", now - timedelta(hours=6), "VERIFIED")
        ]

        for c_obj, ev_type, desc, dt, status_str in events_data:
            event = Event(
                case_id=c_obj.id,
                event_type=ev_type,
                description=desc,
                date_time=dt,
                status=status_str,
                attributes={}
            )
            db.add(event)

        db.commit()

        # ─── 7. Seed Audit Logs ───
        print("Seeding Chennai Cyber Crime audit logs...")
        logs_data = [
            (seeded_users["SUPER_ADMIN"].id, "SYSTEM_INIT", "SYSTEM", None, {"action": "Chennai Cyber Crime Wing Intelligence Base Initialized"}),
            (seeded_users["SUPER_ADMIN"].id, "CREATE_CASE", "CASE", case_marina.id, {"case_name": "Operation Marina Net"}),
            (seeded_users["INVESTIGATOR"].id, "UPLOAD_DATASET", "SOURCE", source_call.id, {"filename": "chennai_tower_intercepts.csv"}),
            (seeded_users["EVIDENCE_REVIEWER"].id, "EVIDENCE_VERIFIED", "EVIDENCE", vector_ids[0], {"status": "VERIFIED"}),
            (seeded_users["ANALYST"].id, "QUERY_HACKER_AI", "RAG", None, {"query": "Find all mobile numbers active near Taramani OMR Tech Park."})
        ]

        for u_id, act, r_type, r_id, meta in logs_data:
            al = AuditLog(
                user_id=u_id,
                action=act,
                resource_type=r_type,
                resource_id=r_id,
                metadata_=meta,
                timestamp=now - timedelta(hours=2)
            )
            db.add(al)

        db.commit()
        print("Seeded Chennai Cyber Crime Wing baseline successfully!")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
