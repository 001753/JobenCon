-- ============================================================
-- Audit Log — Append-Only Enforcement
-- Jalankan setelah prisma migrate deploy
-- ============================================================

-- Function: cegah UPDATE dan DELETE pada audit_log
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only. Modifications and deletions are not permitted. (actor_id: %, action: %)',
    OLD.actor_id, OLD.action;
END;
$$ LANGUAGE plpgsql;

-- Trigger: enforce append-only pada setiap row
DROP TRIGGER IF EXISTS enforce_audit_append_only ON audit_log;
CREATE TRIGGER enforce_audit_append_only
  BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_modification();

-- Function: updated_at auto-update untuk tabel yang butuh
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
