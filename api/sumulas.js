// api/sumulas.js — Vercel Serverless Function
// Retorna súmulas do Supabase filtradas por tribunal e tipo
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // cache 1h

  const { tribunal, tipo, area, limite = 200 } = req.query;

  let query = supabase
    .from('sumulas')
    .select('sid,numero,tribunal,tipo,nome,texto,analise,area,url')
    .order('numero', { ascending: true })
    .limit(Number(limite));

  if (tribunal) query = query.eq('tribunal', tribunal);
  if (tipo)     query = query.eq('tipo', tipo);
  if (area)     query = query.eq('area', area);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ sumulas: data || [] });
}
