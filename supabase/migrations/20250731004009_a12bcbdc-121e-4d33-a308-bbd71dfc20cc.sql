-- Fix the remaining function security issue
CREATE OR REPLACE FUNCTION public.update_camera_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update reports count and confidence for camera locations
  UPDATE public.camera_locations 
  SET 
    reports_count = (
      SELECT COUNT(*) FROM public.camera_reports 
      WHERE camera_id = NEW.camera_id AND report_type = 'confirmed'
    ),
    confidence = LEAST(1.0, (
      SELECT COUNT(*) FROM public.camera_reports 
      WHERE camera_id = NEW.camera_id AND report_type = 'confirmed'
    ) * 0.1 + 0.3),
    verified = (
      SELECT COUNT(*) FROM public.camera_reports 
      WHERE camera_id = NEW.camera_id AND report_type = 'confirmed'
    ) >= 3,
    updated_at = now()
  WHERE id = NEW.camera_id;
  
  RETURN NEW;
END;
$$;