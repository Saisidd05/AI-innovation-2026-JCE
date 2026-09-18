"""
Centralized permission definitions for role-based access control.
"""

# Permission constants
VIEW_CASES = "view_cases"
CREATE_CASE = "create_case"
EDIT_CASE = "edit_case"
DELETE_CASE = "delete_case"
UPLOAD_DATASET = "upload_dataset"
USE_RAG = "use_rag"
VIEW_GRAPH = "view_graph"
RUN_ANALYTICS = "run_analytics"
VERIFY_EVIDENCE = "verify_evidence"
MANAGE_USERS = "manage_users"
EXPORT_REPORTS = "export_reports"
VIEW_AUDIT_LOGS = "view_audit_logs"
VIEW_EVIDENCE = "view_evidence"
ADD_NOTES = "add_notes"

# Role → Permissions mapping
ROLE_PERMISSIONS: dict[str, list[str]] = {
    "SUPER_ADMIN": [
        VIEW_CASES, CREATE_CASE, EDIT_CASE, DELETE_CASE,
        UPLOAD_DATASET, USE_RAG, VIEW_GRAPH, RUN_ANALYTICS,
        VERIFY_EVIDENCE, MANAGE_USERS, EXPORT_REPORTS,
        VIEW_AUDIT_LOGS, VIEW_EVIDENCE, ADD_NOTES,
    ],
    "INVESTIGATION_ADMIN": [
        VIEW_CASES, CREATE_CASE, EDIT_CASE,
        UPLOAD_DATASET, USE_RAG, VIEW_GRAPH, RUN_ANALYTICS,
        VIEW_EVIDENCE, EXPORT_REPORTS, ADD_NOTES,
    ],
    "INVESTIGATOR": [
        VIEW_CASES, UPLOAD_DATASET, USE_RAG, VIEW_GRAPH,
        VIEW_EVIDENCE, ADD_NOTES,
    ],
    "ANALYST": [
        VIEW_CASES, USE_RAG, VIEW_GRAPH, RUN_ANALYTICS,
        VIEW_EVIDENCE, EXPORT_REPORTS,
    ],
    "EVIDENCE_REVIEWER": [
        VIEW_CASES, VIEW_EVIDENCE, VERIFY_EVIDENCE,
        VIEW_AUDIT_LOGS,
    ],
    "VIEWER": [
        VIEW_CASES, VIEW_GRAPH, VIEW_EVIDENCE,
    ],
}

def get_permissions_for_role(role: str) -> list[str]:
    return ROLE_PERMISSIONS.get(role, [])

def has_permission(role: str, permission: str) -> bool:
    return permission in ROLE_PERMISSIONS.get(role, [])
