-- ============================================================
-- TimescaleDB Initialization
-- Jalankan SETELAH prisma migrate deploy, di environment
-- yang sudah install ekstensi TimescaleDB.
-- 
-- Di Replit dev environment, skip ini — price_snapshots
-- akan berfungsi sebagai tabel PostgreSQL biasa.
-- ============================================================

-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Convert price_snapshots ke hypertable
-- chunk_time_interval = 1 bulan (optimal untuk price history queries)
SELECT create_hypertable(
  'price_snapshots',
  'ts',
  chunk_time_interval => INTERVAL '1 month',
  if_not_exists => TRUE
);

-- Compression policy: kompres chunk yang lebih dari 3 bulan
ALTER TABLE price_snapshots SET (
  timescaledb.compress,
  timescaledb.compress_orderby = 'ts DESC',
  timescaledb.compress_segmentby = 'asset_identifier, asset_category'
);

SELECT add_compression_policy('price_snapshots', INTERVAL '3 months');

-- Retention policy: hapus data lebih dari 2 tahun
-- (sesuaikan dengan subscription plan tertinggi)
SELECT add_retention_policy('price_snapshots', INTERVAL '2 years');

-- Latest price view (performance optimization)
CREATE OR REPLACE VIEW latest_prices AS
  SELECT DISTINCT ON (asset_identifier, asset_category)
    asset_identifier,
    asset_category,
    price_idr,
    price_usd,
    price_native,
    price_currency,
    source,
    delay_minutes,
    ts
  FROM price_snapshots
  ORDER BY asset_identifier, asset_category, ts DESC;
