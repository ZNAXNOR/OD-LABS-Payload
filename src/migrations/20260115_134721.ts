import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'admin', 'editor', 'author', 'user');
  CREATE TYPE "public"."typ" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."app" AS ENUM('default', 'secondary', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum_pages_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum_pages_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum_pages_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum_pages_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum_pages_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum_pages_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('centered', 'split', 'banner', 'card');
  CREATE TYPE "public"."enum_pages_blocks_cta_background_color" AS ENUM('default', 'primary', 'dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_cta_pattern" AS ENUM('none', 'dots', 'grid', 'waves');
  CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('blogs', 'services');
  CREATE TYPE "public"."enum_pages_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_pages_blocks_code_language" AS ENUM('typescript', 'javascript', 'python', 'java', 'csharp', 'cpp', 'c', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'scss', 'json', 'yaml', 'markdown', 'sql', 'bash', 'shell', 'powershell', 'graphql', 'dockerfile');
  CREATE TYPE "public"."enum_pages_blocks_code_theme" AS ENUM('auto', 'dark', 'light');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_services_grid_style" AS ENUM('cards', 'minimal', 'bordered');
  CREATE TYPE "public"."enum_pages_blocks_tech_stack_technologies_category" AS ENUM('frontend', 'backend', 'database', 'devops', 'tools', 'other');
  CREATE TYPE "public"."enum_pages_blocks_tech_stack_technologies_proficiency" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');
  CREATE TYPE "public"."enum_pages_blocks_tech_stack_layout" AS ENUM('grid', 'carousel', 'list');
  CREATE TYPE "public"."enum_pages_blocks_process_steps_layout" AS ENUM('vertical', 'horizontal', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_process_steps_style" AS ENUM('numbered', 'icons', 'timeline');
  CREATE TYPE "public"."enum_pages_blocks_pricing_table_tiers_period" AS ENUM('month', 'year', 'project', 'hour');
  CREATE TYPE "public"."enum_pages_blocks_pricing_table_billing_period" AS ENUM('monthly', 'yearly', 'both');
  CREATE TYPE "public"."enum_pages_blocks_project_showcase_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_project_showcase_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_before_after_orientation" AS ENUM('horizontal', 'vertical');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_layout" AS ENUM('single', 'grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_columns" AS ENUM('2', '3', '4', '6');
  CREATE TYPE "public"."enum_pages_blocks_feature_grid_style" AS ENUM('cards', 'minimal', 'icons');
  CREATE TYPE "public"."enum_pages_blocks_stats_counter_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_timeline_orientation" AS ENUM('vertical', 'horizontal');
  CREATE TYPE "public"."enum_pages_blocks_timeline_style" AS ENUM('default', 'minimal', 'detailed');
  CREATE TYPE "public"."enum_pages_blocks_contact_form_layout" AS ENUM('single', 'split');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_style" AS ENUM('inline', 'card', 'minimal');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_provider" AS ENUM('custom', 'mailchimp', 'convertkit');
  CREATE TYPE "public"."enum_pages_blocks_social_proof_type" AS ENUM('logos', 'stats', 'badges', 'combined');
  CREATE TYPE "public"."enum_pages_blocks_social_proof_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum_pages_blocks_container_max_width" AS ENUM('sm', 'md', 'lg', 'xl', '2xl', 'full');
  CREATE TYPE "public"."enum_pages_blocks_container_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'zinc-900', 'brand-primary');
  CREATE TYPE "public"."enum_pages_blocks_container_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_container_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_container_margin_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_container_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_divider_style" AS ENUM('solid', 'dashed', 'dotted', 'gradient');
  CREATE TYPE "public"."enum_pages_blocks_divider_thickness" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_divider_color" AS ENUM('zinc-200', 'zinc-300', 'zinc-400', 'zinc-800', 'brand-primary');
  CREATE TYPE "public"."enum_pages_blocks_divider_width" AS ENUM('full', 'half', 'quarter');
  CREATE TYPE "public"."enum_pages_blocks_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_divider_spacing_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_blocks_divider_spacing_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum_pages_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('centered', 'split', 'banner', 'card');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_background_color" AS ENUM('default', 'primary', 'dark', 'light');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_pattern" AS ENUM('none', 'dots', 'grid', 'waves');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('blogs', 'services');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum__pages_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'python', 'java', 'csharp', 'cpp', 'c', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'scss', 'json', 'yaml', 'markdown', 'sql', 'bash', 'shell', 'powershell', 'graphql', 'dockerfile');
  CREATE TYPE "public"."enum__pages_v_blocks_code_theme" AS ENUM('auto', 'dark', 'light');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_services_grid_style" AS ENUM('cards', 'minimal', 'bordered');
  CREATE TYPE "public"."enum__pages_v_blocks_tech_stack_technologies_category" AS ENUM('frontend', 'backend', 'database', 'devops', 'tools', 'other');
  CREATE TYPE "public"."enum__pages_v_blocks_tech_stack_technologies_proficiency" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');
  CREATE TYPE "public"."enum__pages_v_blocks_tech_stack_layout" AS ENUM('grid', 'carousel', 'list');
  CREATE TYPE "public"."enum__pages_v_blocks_process_steps_layout" AS ENUM('vertical', 'horizontal', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_process_steps_style" AS ENUM('numbered', 'icons', 'timeline');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_table_tiers_period" AS ENUM('month', 'year', 'project', 'hour');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_table_billing_period" AS ENUM('monthly', 'yearly', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_project_showcase_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_project_showcase_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_before_after_orientation" AS ENUM('horizontal', 'vertical');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_layout" AS ENUM('single', 'grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_columns" AS ENUM('2', '3', '4', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_grid_style" AS ENUM('cards', 'minimal', 'icons');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_counter_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_timeline_orientation" AS ENUM('vertical', 'horizontal');
  CREATE TYPE "public"."enum__pages_v_blocks_timeline_style" AS ENUM('default', 'minimal', 'detailed');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_form_layout" AS ENUM('single', 'split');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_style" AS ENUM('inline', 'card', 'minimal');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_provider" AS ENUM('custom', 'mailchimp', 'convertkit');
  CREATE TYPE "public"."enum__pages_v_blocks_social_proof_type" AS ENUM('logos', 'stats', 'badges', 'combined');
  CREATE TYPE "public"."enum__pages_v_blocks_social_proof_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum__pages_v_blocks_container_max_width" AS ENUM('sm', 'md', 'lg', 'xl', '2xl', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_container_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'zinc-900', 'brand-primary');
  CREATE TYPE "public"."enum__pages_v_blocks_container_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_container_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_container_margin_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_container_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_style" AS ENUM('solid', 'dashed', 'dotted', 'gradient');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_thickness" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_color" AS ENUM('zinc-200', 'zinc-300', 'zinc-400', 'zinc-800', 'brand-primary');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_width" AS ENUM('full', 'half', 'quarter');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_spacing_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_divider_spacing_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_version_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_blogs_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_blogs_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum_blogs_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum_blogs_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_blogs_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_blogs_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum_blogs_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum_blogs_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum_blogs_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum_blogs_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum_blogs_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_blogs_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum_blogs_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_blogs_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_blogs_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_blogs_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_blogs_blocks_archive_relation_to" AS ENUM('blogs', 'services');
  CREATE TYPE "public"."enum_blogs_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_blogs_blocks_code_language" AS ENUM('typescript', 'javascript', 'python', 'java', 'csharp', 'cpp', 'c', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'scss', 'json', 'yaml', 'markdown', 'sql', 'bash', 'shell', 'powershell', 'graphql', 'dockerfile');
  CREATE TYPE "public"."enum_blogs_blocks_code_theme" AS ENUM('auto', 'dark', 'light');
  CREATE TYPE "public"."enum_blogs_blocks_feature_grid_columns" AS ENUM('2', '3', '4', '6');
  CREATE TYPE "public"."enum_blogs_blocks_feature_grid_style" AS ENUM('cards', 'minimal', 'icons');
  CREATE TYPE "public"."enum_blogs_blocks_stats_counter_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum_blogs_blocks_timeline_orientation" AS ENUM('vertical', 'horizontal');
  CREATE TYPE "public"."enum_blogs_blocks_timeline_style" AS ENUM('default', 'minimal', 'detailed');
  CREATE TYPE "public"."enum_blogs_blocks_cta_variant" AS ENUM('centered', 'split', 'banner', 'card');
  CREATE TYPE "public"."enum_blogs_blocks_cta_background_color" AS ENUM('default', 'primary', 'dark', 'light');
  CREATE TYPE "public"."enum_blogs_blocks_cta_pattern" AS ENUM('none', 'dots', 'grid', 'waves');
  CREATE TYPE "public"."enum_blogs_blocks_newsletter_style" AS ENUM('inline', 'card', 'minimal');
  CREATE TYPE "public"."enum_blogs_blocks_newsletter_provider" AS ENUM('custom', 'mailchimp', 'convertkit');
  CREATE TYPE "public"."enum_blogs_blocks_social_proof_type" AS ENUM('logos', 'stats', 'badges', 'combined');
  CREATE TYPE "public"."enum_blogs_blocks_social_proof_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum_blogs_blocks_container_max_width" AS ENUM('sm', 'md', 'lg', 'xl', '2xl', 'full');
  CREATE TYPE "public"."enum_blogs_blocks_container_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'zinc-900', 'brand-primary');
  CREATE TYPE "public"."enum_blogs_blocks_container_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_blogs_blocks_container_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_blogs_blocks_container_margin_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_blogs_blocks_container_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_blogs_blocks_divider_style" AS ENUM('solid', 'dashed', 'dotted', 'gradient');
  CREATE TYPE "public"."enum_blogs_blocks_divider_thickness" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_blogs_blocks_divider_color" AS ENUM('zinc-200', 'zinc-300', 'zinc-400', 'zinc-800', 'brand-primary');
  CREATE TYPE "public"."enum_blogs_blocks_divider_width" AS ENUM('full', 'half', 'quarter');
  CREATE TYPE "public"."enum_blogs_blocks_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_blogs_blocks_divider_spacing_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_blogs_blocks_divider_spacing_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_blogs_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum_blogs_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum_blogs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum__blogs_v_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum__blogs_v_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__blogs_v_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum__blogs_v_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__blogs_v_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__blogs_v_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__blogs_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__blogs_v_blocks_archive_relation_to" AS ENUM('blogs', 'services');
  CREATE TYPE "public"."enum__blogs_v_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum__blogs_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'python', 'java', 'csharp', 'cpp', 'c', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'scss', 'json', 'yaml', 'markdown', 'sql', 'bash', 'shell', 'powershell', 'graphql', 'dockerfile');
  CREATE TYPE "public"."enum__blogs_v_blocks_code_theme" AS ENUM('auto', 'dark', 'light');
  CREATE TYPE "public"."enum__blogs_v_blocks_feature_grid_columns" AS ENUM('2', '3', '4', '6');
  CREATE TYPE "public"."enum__blogs_v_blocks_feature_grid_style" AS ENUM('cards', 'minimal', 'icons');
  CREATE TYPE "public"."enum__blogs_v_blocks_stats_counter_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum__blogs_v_blocks_timeline_orientation" AS ENUM('vertical', 'horizontal');
  CREATE TYPE "public"."enum__blogs_v_blocks_timeline_style" AS ENUM('default', 'minimal', 'detailed');
  CREATE TYPE "public"."enum__blogs_v_blocks_cta_variant" AS ENUM('centered', 'split', 'banner', 'card');
  CREATE TYPE "public"."enum__blogs_v_blocks_cta_background_color" AS ENUM('default', 'primary', 'dark', 'light');
  CREATE TYPE "public"."enum__blogs_v_blocks_cta_pattern" AS ENUM('none', 'dots', 'grid', 'waves');
  CREATE TYPE "public"."enum__blogs_v_blocks_newsletter_style" AS ENUM('inline', 'card', 'minimal');
  CREATE TYPE "public"."enum__blogs_v_blocks_newsletter_provider" AS ENUM('custom', 'mailchimp', 'convertkit');
  CREATE TYPE "public"."enum__blogs_v_blocks_social_proof_type" AS ENUM('logos', 'stats', 'badges', 'combined');
  CREATE TYPE "public"."enum__blogs_v_blocks_social_proof_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum__blogs_v_blocks_container_max_width" AS ENUM('sm', 'md', 'lg', 'xl', '2xl', 'full');
  CREATE TYPE "public"."enum__blogs_v_blocks_container_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'zinc-900', 'brand-primary');
  CREATE TYPE "public"."enum__blogs_v_blocks_container_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__blogs_v_blocks_container_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__blogs_v_blocks_container_margin_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__blogs_v_blocks_container_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__blogs_v_blocks_divider_style" AS ENUM('solid', 'dashed', 'dotted', 'gradient');
  CREATE TYPE "public"."enum__blogs_v_blocks_divider_thickness" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__blogs_v_blocks_divider_color" AS ENUM('zinc-200', 'zinc-300', 'zinc-400', 'zinc-800', 'brand-primary');
  CREATE TYPE "public"."enum__blogs_v_blocks_divider_width" AS ENUM('full', 'half', 'quarter');
  CREATE TYPE "public"."enum__blogs_v_blocks_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__blogs_v_blocks_divider_spacing_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__blogs_v_blocks_divider_spacing_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__blogs_v_version_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum__blogs_v_version_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum__blogs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_services_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_services_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum_services_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum_services_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_services_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_services_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum_services_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum_services_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum_services_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum_services_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum_services_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_services_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum_services_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_services_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_services_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_services_blocks_cta_variant" AS ENUM('centered', 'split', 'banner', 'card');
  CREATE TYPE "public"."enum_services_blocks_cta_background_color" AS ENUM('default', 'primary', 'dark', 'light');
  CREATE TYPE "public"."enum_services_blocks_cta_pattern" AS ENUM('none', 'dots', 'grid', 'waves');
  CREATE TYPE "public"."enum_services_blocks_services_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_services_blocks_services_grid_style" AS ENUM('cards', 'minimal', 'bordered');
  CREATE TYPE "public"."enum_services_blocks_tech_stack_technologies_category" AS ENUM('frontend', 'backend', 'database', 'devops', 'tools', 'other');
  CREATE TYPE "public"."enum_services_blocks_tech_stack_technologies_proficiency" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');
  CREATE TYPE "public"."enum_services_blocks_tech_stack_layout" AS ENUM('grid', 'carousel', 'list');
  CREATE TYPE "public"."enum_services_blocks_process_steps_layout" AS ENUM('vertical', 'horizontal', 'grid');
  CREATE TYPE "public"."enum_services_blocks_process_steps_style" AS ENUM('numbered', 'icons', 'timeline');
  CREATE TYPE "public"."enum_services_blocks_pricing_table_tiers_period" AS ENUM('month', 'year', 'project', 'hour');
  CREATE TYPE "public"."enum_services_blocks_pricing_table_billing_period" AS ENUM('monthly', 'yearly', 'both');
  CREATE TYPE "public"."enum_services_blocks_testimonial_layout" AS ENUM('single', 'grid', 'carousel');
  CREATE TYPE "public"."enum_services_blocks_feature_grid_columns" AS ENUM('2', '3', '4', '6');
  CREATE TYPE "public"."enum_services_blocks_feature_grid_style" AS ENUM('cards', 'minimal', 'icons');
  CREATE TYPE "public"."enum_services_blocks_stats_counter_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum_services_blocks_contact_form_layout" AS ENUM('single', 'split');
  CREATE TYPE "public"."enum_services_blocks_newsletter_style" AS ENUM('inline', 'card', 'minimal');
  CREATE TYPE "public"."enum_services_blocks_newsletter_provider" AS ENUM('custom', 'mailchimp', 'convertkit');
  CREATE TYPE "public"."enum_services_blocks_social_proof_type" AS ENUM('logos', 'stats', 'badges', 'combined');
  CREATE TYPE "public"."enum_services_blocks_social_proof_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum_services_blocks_container_max_width" AS ENUM('sm', 'md', 'lg', 'xl', '2xl', 'full');
  CREATE TYPE "public"."enum_services_blocks_container_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'zinc-900', 'brand-primary');
  CREATE TYPE "public"."enum_services_blocks_container_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_services_blocks_container_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_services_blocks_container_margin_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_services_blocks_container_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_services_blocks_divider_style" AS ENUM('solid', 'dashed', 'dotted', 'gradient');
  CREATE TYPE "public"."enum_services_blocks_divider_thickness" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_services_blocks_divider_color" AS ENUM('zinc-200', 'zinc-300', 'zinc-400', 'zinc-800', 'brand-primary');
  CREATE TYPE "public"."enum_services_blocks_divider_width" AS ENUM('full', 'half', 'quarter');
  CREATE TYPE "public"."enum_services_blocks_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_services_blocks_divider_spacing_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_services_blocks_divider_spacing_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_services_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum_services_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum_services_service_type" AS ENUM('web-dev', 'mobile-dev', 'design', 'consulting', 'support', 'marketing', 'other');
  CREATE TYPE "public"."enum_services_pricing_currency" AS ENUM('USD', 'EUR', 'GBP', 'INR');
  CREATE TYPE "public"."enum_services_pricing_pricing_model" AS ENUM('fixed', 'hourly', 'monthly', 'custom');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__services_v_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum__services_v_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum__services_v_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__services_v_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__services_v_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum__services_v_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum__services_v_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum__services_v_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum__services_v_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum__services_v_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__services_v_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum__services_v_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__services_v_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__services_v_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__services_v_blocks_cta_variant" AS ENUM('centered', 'split', 'banner', 'card');
  CREATE TYPE "public"."enum__services_v_blocks_cta_background_color" AS ENUM('default', 'primary', 'dark', 'light');
  CREATE TYPE "public"."enum__services_v_blocks_cta_pattern" AS ENUM('none', 'dots', 'grid', 'waves');
  CREATE TYPE "public"."enum__services_v_blocks_services_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__services_v_blocks_services_grid_style" AS ENUM('cards', 'minimal', 'bordered');
  CREATE TYPE "public"."enum__services_v_blocks_tech_stack_technologies_category" AS ENUM('frontend', 'backend', 'database', 'devops', 'tools', 'other');
  CREATE TYPE "public"."enum__services_v_blocks_tech_stack_technologies_proficiency" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');
  CREATE TYPE "public"."enum__services_v_blocks_tech_stack_layout" AS ENUM('grid', 'carousel', 'list');
  CREATE TYPE "public"."enum__services_v_blocks_process_steps_layout" AS ENUM('vertical', 'horizontal', 'grid');
  CREATE TYPE "public"."enum__services_v_blocks_process_steps_style" AS ENUM('numbered', 'icons', 'timeline');
  CREATE TYPE "public"."enum__services_v_blocks_pricing_table_tiers_period" AS ENUM('month', 'year', 'project', 'hour');
  CREATE TYPE "public"."enum__services_v_blocks_pricing_table_billing_period" AS ENUM('monthly', 'yearly', 'both');
  CREATE TYPE "public"."enum__services_v_blocks_testimonial_layout" AS ENUM('single', 'grid', 'carousel');
  CREATE TYPE "public"."enum__services_v_blocks_feature_grid_columns" AS ENUM('2', '3', '4', '6');
  CREATE TYPE "public"."enum__services_v_blocks_feature_grid_style" AS ENUM('cards', 'minimal', 'icons');
  CREATE TYPE "public"."enum__services_v_blocks_stats_counter_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum__services_v_blocks_contact_form_layout" AS ENUM('single', 'split');
  CREATE TYPE "public"."enum__services_v_blocks_newsletter_style" AS ENUM('inline', 'card', 'minimal');
  CREATE TYPE "public"."enum__services_v_blocks_newsletter_provider" AS ENUM('custom', 'mailchimp', 'convertkit');
  CREATE TYPE "public"."enum__services_v_blocks_social_proof_type" AS ENUM('logos', 'stats', 'badges', 'combined');
  CREATE TYPE "public"."enum__services_v_blocks_social_proof_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum__services_v_blocks_container_max_width" AS ENUM('sm', 'md', 'lg', 'xl', '2xl', 'full');
  CREATE TYPE "public"."enum__services_v_blocks_container_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'zinc-900', 'brand-primary');
  CREATE TYPE "public"."enum__services_v_blocks_container_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__services_v_blocks_container_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__services_v_blocks_container_margin_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__services_v_blocks_container_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__services_v_blocks_divider_style" AS ENUM('solid', 'dashed', 'dotted', 'gradient');
  CREATE TYPE "public"."enum__services_v_blocks_divider_thickness" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__services_v_blocks_divider_color" AS ENUM('zinc-200', 'zinc-300', 'zinc-400', 'zinc-800', 'brand-primary');
  CREATE TYPE "public"."enum__services_v_blocks_divider_width" AS ENUM('full', 'half', 'quarter');
  CREATE TYPE "public"."enum__services_v_blocks_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__services_v_blocks_divider_spacing_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__services_v_blocks_divider_spacing_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__services_v_version_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum__services_v_version_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum__services_v_version_service_type" AS ENUM('web-dev', 'mobile-dev', 'design', 'consulting', 'support', 'marketing', 'other');
  CREATE TYPE "public"."enum__services_v_version_pricing_currency" AS ENUM('USD', 'EUR', 'GBP', 'INR');
  CREATE TYPE "public"."enum__services_v_version_pricing_pricing_model" AS ENUM('fixed', 'hourly', 'monthly', 'custom');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_legal_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_legal_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum_legal_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_legal_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_legal_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_legal_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_legal_blocks_container_max_width" AS ENUM('sm', 'md', 'lg', 'xl', '2xl', 'full');
  CREATE TYPE "public"."enum_legal_blocks_container_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'zinc-900', 'brand-primary');
  CREATE TYPE "public"."enum_legal_blocks_container_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_legal_blocks_container_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_legal_blocks_container_margin_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_legal_blocks_container_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_legal_blocks_divider_style" AS ENUM('solid', 'dashed', 'dotted', 'gradient');
  CREATE TYPE "public"."enum_legal_blocks_divider_thickness" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_legal_blocks_divider_color" AS ENUM('zinc-200', 'zinc-300', 'zinc-400', 'zinc-800', 'brand-primary');
  CREATE TYPE "public"."enum_legal_blocks_divider_width" AS ENUM('full', 'half', 'quarter');
  CREATE TYPE "public"."enum_legal_blocks_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_legal_blocks_divider_spacing_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_legal_blocks_divider_spacing_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_legal_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum_legal_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum_legal_document_type" AS ENUM('privacy', 'terms', 'cookies', 'gdpr', 'disclaimer', 'license', 'other');
  CREATE TYPE "public"."enum_legal_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__legal_v_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__legal_v_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum__legal_v_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__legal_v_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__legal_v_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__legal_v_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum__legal_v_blocks_container_max_width" AS ENUM('sm', 'md', 'lg', 'xl', '2xl', 'full');
  CREATE TYPE "public"."enum__legal_v_blocks_container_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'zinc-900', 'brand-primary');
  CREATE TYPE "public"."enum__legal_v_blocks_container_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__legal_v_blocks_container_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__legal_v_blocks_container_margin_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__legal_v_blocks_container_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__legal_v_blocks_divider_style" AS ENUM('solid', 'dashed', 'dotted', 'gradient');
  CREATE TYPE "public"."enum__legal_v_blocks_divider_thickness" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__legal_v_blocks_divider_color" AS ENUM('zinc-200', 'zinc-300', 'zinc-400', 'zinc-800', 'brand-primary');
  CREATE TYPE "public"."enum__legal_v_blocks_divider_width" AS ENUM('full', 'half', 'quarter');
  CREATE TYPE "public"."enum__legal_v_blocks_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__legal_v_blocks_divider_spacing_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__legal_v_blocks_divider_spacing_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__legal_v_version_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum__legal_v_version_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum__legal_v_version_document_type" AS ENUM('privacy', 'terms', 'cookies', 'gdpr', 'disclaimer', 'license', 'other');
  CREATE TYPE "public"."enum__legal_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_contacts_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_contacts_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum_contacts_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum_contacts_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum_contacts_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_contacts_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum_contacts_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum_contacts_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum_contacts_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum_contacts_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum_contacts_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum_contacts_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum_contacts_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_contacts_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_contacts_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_contacts_blocks_contact_form_layout" AS ENUM('single', 'split');
  CREATE TYPE "public"."enum_contacts_blocks_social_proof_type" AS ENUM('logos', 'stats', 'badges', 'combined');
  CREATE TYPE "public"."enum_contacts_blocks_social_proof_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum_contacts_blocks_container_max_width" AS ENUM('sm', 'md', 'lg', 'xl', '2xl', 'full');
  CREATE TYPE "public"."enum_contacts_blocks_container_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'zinc-900', 'brand-primary');
  CREATE TYPE "public"."enum_contacts_blocks_container_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_contacts_blocks_container_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_contacts_blocks_container_margin_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_contacts_blocks_container_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_contacts_blocks_divider_style" AS ENUM('solid', 'dashed', 'dotted', 'gradient');
  CREATE TYPE "public"."enum_contacts_blocks_divider_thickness" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_contacts_blocks_divider_color" AS ENUM('zinc-200', 'zinc-300', 'zinc-400', 'zinc-800', 'brand-primary');
  CREATE TYPE "public"."enum_contacts_blocks_divider_width" AS ENUM('full', 'half', 'quarter');
  CREATE TYPE "public"."enum_contacts_blocks_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_contacts_blocks_divider_spacing_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_contacts_blocks_divider_spacing_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_contacts_contact_info_sections" AS ENUM('general', 'offices', 'social', 'hours');
  CREATE TYPE "public"."enum_contacts_purpose" AS ENUM('general', 'technical', 'bug', 'feature', 'feedback', 'sales', 'partnership', 'media', 'careers', 'custom');
  CREATE TYPE "public"."enum_contacts_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum_contacts_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum_contacts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_actions_priority" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_variant" AS ENUM('default', 'centered', 'minimal', 'split', 'gradient', 'codeTerminal');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_code_snippet_language" AS ENUM('javascript', 'typescript', 'python', 'bash', 'json');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_code_snippet_theme" AS ENUM('dark', 'light');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_split_layout_content_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_split_layout_media_type" AS ENUM('image', 'video', 'code');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_gradient_config_animation" AS ENUM('wave', 'pulse', 'rotate');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_settings_theme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_settings_height" AS ENUM('small', 'medium', 'large', 'auto');
  CREATE TYPE "public"."enum__contacts_v_blocks_hero_settings_overlay_color" AS ENUM('black', 'white', 'primary');
  CREATE TYPE "public"."enum__contacts_v_blocks_content_columns_width" AS ENUM('oneThird', 'half', 'twoThirds', 'full', 'auto');
  CREATE TYPE "public"."enum__contacts_v_blocks_content_columns_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'brand-primary');
  CREATE TYPE "public"."enum__contacts_v_blocks_content_columns_padding" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__contacts_v_blocks_content_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__contacts_v_blocks_content_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__contacts_v_blocks_contact_form_layout" AS ENUM('single', 'split');
  CREATE TYPE "public"."enum__contacts_v_blocks_social_proof_type" AS ENUM('logos', 'stats', 'badges', 'combined');
  CREATE TYPE "public"."enum__contacts_v_blocks_social_proof_layout" AS ENUM('row', 'grid');
  CREATE TYPE "public"."enum__contacts_v_blocks_container_max_width" AS ENUM('sm', 'md', 'lg', 'xl', '2xl', 'full');
  CREATE TYPE "public"."enum__contacts_v_blocks_container_background_color" AS ENUM('none', 'white', 'zinc-50', 'zinc-100', 'zinc-900', 'brand-primary');
  CREATE TYPE "public"."enum__contacts_v_blocks_container_padding_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__contacts_v_blocks_container_padding_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__contacts_v_blocks_container_margin_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__contacts_v_blocks_container_margin_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__contacts_v_blocks_divider_style" AS ENUM('solid', 'dashed', 'dotted', 'gradient');
  CREATE TYPE "public"."enum__contacts_v_blocks_divider_thickness" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__contacts_v_blocks_divider_color" AS ENUM('zinc-200', 'zinc-300', 'zinc-400', 'zinc-800', 'brand-primary');
  CREATE TYPE "public"."enum__contacts_v_blocks_divider_width" AS ENUM('full', 'half', 'quarter');
  CREATE TYPE "public"."enum__contacts_v_blocks_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__contacts_v_blocks_divider_spacing_top" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__contacts_v_blocks_divider_spacing_bottom" AS ENUM('none', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__contacts_v_version_contact_info_sections" AS ENUM('general', 'offices', 'social', 'hours');
  CREATE TYPE "public"."enum__contacts_v_version_purpose" AS ENUM('general', 'technical', 'bug', 'feature', 'feedback', 'sales', 'partnership', 'media', 'careers', 'custom');
  CREATE TYPE "public"."enum__contacts_v_version_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum__contacts_v_version_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum__contacts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_header_nav_items_style" AS ENUM('default', 'featured', 'list');
  CREATE TYPE "public"."enum_header_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum_header_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum_footer_meta_structured_type" AS ENUM('Article', 'BlogPosting', 'WebPage', 'Organization', 'Service', 'LocalBusiness', 'FAQPage', 'ContactPage', 'AboutPage', 'custom');
  CREATE TYPE "public"."enum_footer_meta_social_twitter_card" AS ENUM('summary', 'summary_large_image', 'app', 'player');
  CREATE TYPE "public"."enum_contact_social_media_links_platform" AS ENUM('facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'github');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"last_login_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" jsonb,
  	"focal_point" geometry(Point),
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_feature_url" varchar,
  	"sizes_feature_width" numeric,
  	"sizes_feature_height" numeric,
  	"sizes_feature_mime_type" varchar,
  	"sizes_feature_filesize" numeric,
  	"sizes_feature_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"priority" "enum_pages_blocks_hero_actions_priority" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum_pages_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum_pages_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum_pages_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum_pages_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum_pages_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum_pages_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum_pages_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum_pages_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_pages_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"background_color" "enum_pages_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum_pages_blocks_content_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_pages_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum_pages_blocks_content_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_cta_variant" DEFAULT 'centered',
  	"heading" varchar,
  	"description" varchar,
  	"rich_text" jsonb,
  	"media_id" integer,
  	"background_color" "enum_pages_blocks_cta_background_color" DEFAULT 'default',
  	"pattern" "enum_pages_blocks_cta_pattern" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to",
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_pages_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"filename" varchar,
  	"show_line_numbers" boolean DEFAULT true,
  	"highlight_lines" varchar,
  	"theme" "enum_pages_blocks_code_theme" DEFAULT 'auto',
  	"enable_copy" boolean DEFAULT true,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_services_grid_services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "pages_blocks_services_grid_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"highlighted" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum_pages_blocks_services_grid_columns" DEFAULT '3',
  	"style" "enum_pages_blocks_services_grid_style" DEFAULT 'cards',
  	"show_icons" boolean DEFAULT true,
  	"cta_text" varchar,
  	"cta_link_link_type" "typ" DEFAULT 'reference',
  	"cta_link_link_new_tab" boolean,
  	"cta_link_link_url" varchar,
  	"cta_link_link_appearance" "app" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_tech_stack_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"icon_id" integer,
  	"icon_name" varchar,
  	"category" "enum_pages_blocks_tech_stack_technologies_category",
  	"description" varchar,
  	"proficiency" "enum_pages_blocks_tech_stack_technologies_proficiency",
  	"years_experience" numeric
  );
  
  CREATE TABLE "pages_blocks_tech_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_pages_blocks_tech_stack_layout" DEFAULT 'grid',
  	"show_descriptions" boolean DEFAULT false,
  	"enable_filtering" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"details" varchar
  );
  
  CREATE TABLE "pages_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_pages_blocks_process_steps_layout" DEFAULT 'vertical',
  	"style" "enum_pages_blocks_process_steps_style" DEFAULT 'numbered',
  	"show_connectors" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_table_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"included" boolean DEFAULT true,
  	"tooltip" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_table_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"price" numeric,
  	"currency" varchar DEFAULT 'USD',
  	"period" "enum_pages_blocks_pricing_table_tiers_period" DEFAULT 'month',
  	"highlighted" boolean DEFAULT false,
  	"badge" varchar,
  	"cta_text" varchar DEFAULT 'Get Started',
  	"cta_link_link_type" "typ" DEFAULT 'reference',
  	"cta_link_link_new_tab" boolean,
  	"cta_link_link_url" varchar,
  	"cta_link_link_appearance" "app" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_pricing_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"billing_period" "enum_pages_blocks_pricing_table_billing_period" DEFAULT 'monthly',
  	"show_comparison" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_project_showcase_projects_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"technology" varchar
  );
  
  CREATE TABLE "pages_blocks_project_showcase_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"category" varchar,
  	"project_link_link_type" "typ" DEFAULT 'reference',
  	"project_link_link_new_tab" boolean,
  	"project_link_link_url" varchar,
  	"project_link_link_label" varchar,
  	"project_link_link_appearance" "app" DEFAULT 'default',
  	"github_url" varchar,
  	"live_url" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_project_showcase_filter_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" varchar
  );
  
  CREATE TABLE "pages_blocks_project_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_pages_blocks_project_showcase_layout" DEFAULT 'grid',
  	"columns" "enum_pages_blocks_project_showcase_columns" DEFAULT '3',
  	"enable_filtering" boolean DEFAULT true,
  	"show_load_more" boolean DEFAULT false,
  	"items_per_page" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_case_study_approach_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step" varchar
  );
  
  CREATE TABLE "pages_blocks_case_study_solution_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"technology" varchar
  );
  
  CREATE TABLE "pages_blocks_case_study_results_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"change" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_case_study" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"project" varchar,
  	"duration" varchar,
  	"role" varchar,
  	"challenge_heading" varchar DEFAULT 'The Challenge',
  	"challenge_content" varchar,
  	"challenge_image_id" integer,
  	"approach_heading" varchar DEFAULT 'Our Approach',
  	"approach_content" varchar,
  	"solution_heading" varchar DEFAULT 'The Solution',
  	"solution_content" varchar,
  	"solution_image_id" integer,
  	"results_heading" varchar DEFAULT 'The Results',
  	"results_testimonial_quote" varchar,
  	"results_testimonial_author" varchar,
  	"results_testimonial_role" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"before_image_id" integer,
  	"after_image_id" integer,
  	"before_label" varchar DEFAULT 'Before',
  	"after_label" varchar DEFAULT 'After',
  	"orientation" "enum_pages_blocks_before_after_orientation" DEFAULT 'horizontal',
  	"default_position" numeric DEFAULT 50,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonial_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"company" varchar,
  	"avatar_id" integer,
  	"rating" numeric,
  	"date" varchar,
  	"project_type" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_pages_blocks_testimonial_layout" DEFAULT 'grid',
  	"show_ratings" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum_pages_blocks_feature_grid_columns" DEFAULT '3',
  	"style" "enum_pages_blocks_feature_grid_style" DEFAULT 'cards',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_counter_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_counter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_pages_blocks_stats_counter_layout" DEFAULT 'row',
  	"animate_on_scroll" boolean DEFAULT true,
  	"duration" numeric DEFAULT 2000,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"allow_multiple_open" boolean DEFAULT false,
  	"default_open" varchar,
  	"show_search" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"image_id" integer,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"orientation" "enum_pages_blocks_timeline_orientation" DEFAULT 'vertical',
  	"style" "enum_pages_blocks_timeline_style" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_pages_blocks_contact_form_layout" DEFAULT 'single',
  	"form_id" integer,
  	"show_contact_info" boolean DEFAULT false,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_address" varchar,
  	"contact_info_hours" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Enter your email',
  	"button_text" varchar DEFAULT 'Subscribe',
  	"style" "enum_pages_blocks_newsletter_style" DEFAULT 'inline',
  	"show_privacy_note" boolean DEFAULT true,
  	"privacy_text" varchar DEFAULT 'We respect your privacy. Unsubscribe at any time.',
  	"success_message" varchar DEFAULT 'Thanks for subscribing!',
  	"provider" "enum_pages_blocks_newsletter_provider" DEFAULT 'custom',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_social_proof_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_social_proof_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_social_proof_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar
  );
  
  CREATE TABLE "pages_blocks_social_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"type" "enum_pages_blocks_social_proof_type" DEFAULT 'logos',
  	"layout" "enum_pages_blocks_social_proof_layout" DEFAULT 'row',
  	"grayscale" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"max_width" "enum_pages_blocks_container_max_width" DEFAULT 'xl',
  	"background_color" "enum_pages_blocks_container_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"padding_top" "enum_pages_blocks_container_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum_pages_blocks_container_padding_bottom" DEFAULT 'md',
  	"margin_top" "enum_pages_blocks_container_margin_top" DEFAULT 'none',
  	"margin_bottom" "enum_pages_blocks_container_margin_bottom" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_divider_style" DEFAULT 'solid',
  	"thickness" "enum_pages_blocks_divider_thickness" DEFAULT '1',
  	"color" "enum_pages_blocks_divider_color" DEFAULT 'zinc-200',
  	"width" "enum_pages_blocks_divider_width" DEFAULT 'full',
  	"alignment" "enum_pages_blocks_divider_alignment" DEFAULT 'center',
  	"spacing_top" "enum_pages_blocks_divider_spacing_top" DEFAULT 'md',
  	"spacing_bottom" "enum_pages_blocks_divider_spacing_bottom" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height_mobile" numeric DEFAULT 2,
  	"height_tablet" numeric DEFAULT 4,
  	"height_desktop" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_robots_no_index" boolean,
  	"meta_robots_no_follow" boolean,
  	"meta_robots_no_archive" boolean,
  	"meta_robots_no_snippet" boolean,
  	"meta_canonical" varchar,
  	"meta_structured_type" "enum_pages_meta_structured_type",
  	"meta_structured_custom_schema" varchar,
  	"meta_structured_author_id" integer,
  	"meta_structured_date_published" timestamp(3) with time zone,
  	"meta_structured_date_modified" timestamp(3) with time zone,
  	"meta_social_twitter_card" "enum_pages_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"meta_social_twitter_site" varchar,
  	"meta_social_twitter_creator" varchar,
  	"meta_social_facebook_app_id" varchar,
  	"slug" varchar,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"priority" "enum__pages_v_blocks_hero_actions_priority" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum__pages_v_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum__pages_v_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum__pages_v_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum__pages_v_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum__pages_v_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum__pages_v_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum__pages_v_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum__pages_v_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__pages_v_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"background_color" "enum__pages_v_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum__pages_v_blocks_content_columns_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__pages_v_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum__pages_v_blocks_content_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'centered',
  	"heading" varchar,
  	"description" varchar,
  	"rich_text" jsonb,
  	"media_id" integer,
  	"background_color" "enum__pages_v_blocks_cta_background_color" DEFAULT 'default',
  	"pattern" "enum__pages_v_blocks_cta_pattern" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to",
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__pages_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"filename" varchar,
  	"show_line_numbers" boolean DEFAULT true,
  	"highlight_lines" varchar,
  	"theme" "enum__pages_v_blocks_code_theme" DEFAULT 'auto',
  	"enable_copy" boolean DEFAULT true,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid_services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"highlighted" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum__pages_v_blocks_services_grid_columns" DEFAULT '3',
  	"style" "enum__pages_v_blocks_services_grid_style" DEFAULT 'cards',
  	"show_icons" boolean DEFAULT true,
  	"cta_text" varchar,
  	"cta_link_link_type" "typ" DEFAULT 'reference',
  	"cta_link_link_new_tab" boolean,
  	"cta_link_link_url" varchar,
  	"cta_link_link_appearance" "app" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tech_stack_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"icon_id" integer,
  	"icon_name" varchar,
  	"category" "enum__pages_v_blocks_tech_stack_technologies_category",
  	"description" varchar,
  	"proficiency" "enum__pages_v_blocks_tech_stack_technologies_proficiency",
  	"years_experience" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_tech_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__pages_v_blocks_tech_stack_layout" DEFAULT 'grid',
  	"show_descriptions" boolean DEFAULT false,
  	"enable_filtering" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"details" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__pages_v_blocks_process_steps_layout" DEFAULT 'vertical',
  	"style" "enum__pages_v_blocks_process_steps_style" DEFAULT 'numbered',
  	"show_connectors" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_table_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"included" boolean DEFAULT true,
  	"tooltip" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_table_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"price" numeric,
  	"currency" varchar DEFAULT 'USD',
  	"period" "enum__pages_v_blocks_pricing_table_tiers_period" DEFAULT 'month',
  	"highlighted" boolean DEFAULT false,
  	"badge" varchar,
  	"cta_text" varchar DEFAULT 'Get Started',
  	"cta_link_link_type" "typ" DEFAULT 'reference',
  	"cta_link_link_new_tab" boolean,
  	"cta_link_link_url" varchar,
  	"cta_link_link_appearance" "app" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"billing_period" "enum__pages_v_blocks_pricing_table_billing_period" DEFAULT 'monthly',
  	"show_comparison" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_showcase_projects_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"technology" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_showcase_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"category" varchar,
  	"project_link_link_type" "typ" DEFAULT 'reference',
  	"project_link_link_new_tab" boolean,
  	"project_link_link_url" varchar,
  	"project_link_link_label" varchar,
  	"project_link_link_appearance" "app" DEFAULT 'default',
  	"github_url" varchar,
  	"live_url" varchar,
  	"featured" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_showcase_filter_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"category" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__pages_v_blocks_project_showcase_layout" DEFAULT 'grid',
  	"columns" "enum__pages_v_blocks_project_showcase_columns" DEFAULT '3',
  	"enable_filtering" boolean DEFAULT true,
  	"show_load_more" boolean DEFAULT false,
  	"items_per_page" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_study_approach_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"step" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_study_solution_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"technology" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_study_results_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"change" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_study" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"project" varchar,
  	"duration" varchar,
  	"role" varchar,
  	"challenge_heading" varchar DEFAULT 'The Challenge',
  	"challenge_content" varchar,
  	"challenge_image_id" integer,
  	"approach_heading" varchar DEFAULT 'Our Approach',
  	"approach_content" varchar,
  	"solution_heading" varchar DEFAULT 'The Solution',
  	"solution_content" varchar,
  	"solution_image_id" integer,
  	"results_heading" varchar DEFAULT 'The Results',
  	"results_testimonial_quote" varchar,
  	"results_testimonial_author" varchar,
  	"results_testimonial_role" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_before_after" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"before_image_id" integer,
  	"after_image_id" integer,
  	"before_label" varchar DEFAULT 'Before',
  	"after_label" varchar DEFAULT 'After',
  	"orientation" "enum__pages_v_blocks_before_after_orientation" DEFAULT 'horizontal',
  	"default_position" numeric DEFAULT 50,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"company" varchar,
  	"avatar_id" integer,
  	"rating" numeric,
  	"date" varchar,
  	"project_type" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum__pages_v_blocks_testimonial_layout" DEFAULT 'grid',
  	"show_ratings" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum__pages_v_blocks_feature_grid_columns" DEFAULT '3',
  	"style" "enum__pages_v_blocks_feature_grid_style" DEFAULT 'cards',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_counter_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_counter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum__pages_v_blocks_stats_counter_layout" DEFAULT 'row',
  	"animate_on_scroll" boolean DEFAULT true,
  	"duration" numeric DEFAULT 2000,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"allow_multiple_open" boolean DEFAULT false,
  	"default_open" varchar,
  	"show_search" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"image_id" integer,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"orientation" "enum__pages_v_blocks_timeline_orientation" DEFAULT 'vertical',
  	"style" "enum__pages_v_blocks_timeline_style" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__pages_v_blocks_contact_form_layout" DEFAULT 'single',
  	"form_id" integer,
  	"show_contact_info" boolean DEFAULT false,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_address" varchar,
  	"contact_info_hours" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Enter your email',
  	"button_text" varchar DEFAULT 'Subscribe',
  	"style" "enum__pages_v_blocks_newsletter_style" DEFAULT 'inline',
  	"show_privacy_note" boolean DEFAULT true,
  	"privacy_text" varchar DEFAULT 'We respect your privacy. Unsubscribe at any time.',
  	"success_message" varchar DEFAULT 'Thanks for subscribing!',
  	"provider" "enum__pages_v_blocks_newsletter_provider" DEFAULT 'custom',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_social_proof_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_social_proof_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_social_proof_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_social_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"type" "enum__pages_v_blocks_social_proof_type" DEFAULT 'logos',
  	"layout" "enum__pages_v_blocks_social_proof_layout" DEFAULT 'row',
  	"grayscale" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"max_width" "enum__pages_v_blocks_container_max_width" DEFAULT 'xl',
  	"background_color" "enum__pages_v_blocks_container_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"padding_top" "enum__pages_v_blocks_container_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum__pages_v_blocks_container_padding_bottom" DEFAULT 'md',
  	"margin_top" "enum__pages_v_blocks_container_margin_top" DEFAULT 'none',
  	"margin_bottom" "enum__pages_v_blocks_container_margin_bottom" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_divider_style" DEFAULT 'solid',
  	"thickness" "enum__pages_v_blocks_divider_thickness" DEFAULT '1',
  	"color" "enum__pages_v_blocks_divider_color" DEFAULT 'zinc-200',
  	"width" "enum__pages_v_blocks_divider_width" DEFAULT 'full',
  	"alignment" "enum__pages_v_blocks_divider_alignment" DEFAULT 'center',
  	"spacing_top" "enum__pages_v_blocks_divider_spacing_top" DEFAULT 'md',
  	"spacing_bottom" "enum__pages_v_blocks_divider_spacing_bottom" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height_mobile" numeric DEFAULT 2,
  	"height_tablet" numeric DEFAULT 4,
  	"height_desktop" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_keywords" varchar,
  	"version_meta_robots_no_index" boolean,
  	"version_meta_robots_no_follow" boolean,
  	"version_meta_robots_no_archive" boolean,
  	"version_meta_robots_no_snippet" boolean,
  	"version_meta_canonical" varchar,
  	"version_meta_structured_type" "enum__pages_v_version_meta_structured_type",
  	"version_meta_structured_custom_schema" varchar,
  	"version_meta_structured_author_id" integer,
  	"version_meta_structured_date_published" timestamp(3) with time zone,
  	"version_meta_structured_date_modified" timestamp(3) with time zone,
  	"version_meta_social_twitter_card" "enum__pages_v_version_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"version_meta_social_twitter_site" varchar,
  	"version_meta_social_twitter_creator" varchar,
  	"version_meta_social_facebook_app_id" varchar,
  	"version_slug" varchar,
  	"version_parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "blogs_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "blogs_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"priority" "enum_blogs_blocks_hero_actions_priority" DEFAULT 'primary'
  );
  
  CREATE TABLE "blogs_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_blogs_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum_blogs_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum_blogs_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum_blogs_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum_blogs_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum_blogs_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum_blogs_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum_blogs_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum_blogs_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_blogs_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"background_color" "enum_blogs_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum_blogs_blocks_content_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "blogs_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_blogs_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum_blogs_blocks_content_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_blogs_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_blogs_blocks_archive_relation_to",
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_blogs_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_blogs_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"filename" varchar,
  	"show_line_numbers" boolean DEFAULT true,
  	"highlight_lines" varchar,
  	"theme" "enum_blogs_blocks_code_theme" DEFAULT 'auto',
  	"enable_copy" boolean DEFAULT true,
  	"caption" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_feature_grid_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "blogs_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum_blogs_blocks_feature_grid_columns" DEFAULT '3',
  	"style" "enum_blogs_blocks_feature_grid_style" DEFAULT 'cards',
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_stats_counter_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "blogs_blocks_stats_counter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_blogs_blocks_stats_counter_layout" DEFAULT 'row',
  	"animate_on_scroll" boolean DEFAULT true,
  	"duration" numeric DEFAULT 2000,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category" varchar
  );
  
  CREATE TABLE "blogs_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"allow_multiple_open" boolean DEFAULT false,
  	"default_open" varchar,
  	"show_search" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"image_id" integer,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "blogs_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"orientation" "enum_blogs_blocks_timeline_orientation" DEFAULT 'vertical',
  	"style" "enum_blogs_blocks_timeline_style" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default'
  );
  
  CREATE TABLE "blogs_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_blogs_blocks_cta_variant" DEFAULT 'centered',
  	"heading" varchar,
  	"description" varchar,
  	"rich_text" jsonb,
  	"media_id" integer,
  	"background_color" "enum_blogs_blocks_cta_background_color" DEFAULT 'default',
  	"pattern" "enum_blogs_blocks_cta_pattern" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Enter your email',
  	"button_text" varchar DEFAULT 'Subscribe',
  	"style" "enum_blogs_blocks_newsletter_style" DEFAULT 'inline',
  	"show_privacy_note" boolean DEFAULT true,
  	"privacy_text" varchar DEFAULT 'We respect your privacy. Unsubscribe at any time.',
  	"success_message" varchar DEFAULT 'Thanks for subscribing!',
  	"provider" "enum_blogs_blocks_newsletter_provider" DEFAULT 'custom',
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_social_proof_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "blogs_blocks_social_proof_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "blogs_blocks_social_proof_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar
  );
  
  CREATE TABLE "blogs_blocks_social_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"type" "enum_blogs_blocks_social_proof_type" DEFAULT 'logos',
  	"layout" "enum_blogs_blocks_social_proof_layout" DEFAULT 'row',
  	"grayscale" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"max_width" "enum_blogs_blocks_container_max_width" DEFAULT 'xl',
  	"background_color" "enum_blogs_blocks_container_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"padding_top" "enum_blogs_blocks_container_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum_blogs_blocks_container_padding_bottom" DEFAULT 'md',
  	"margin_top" "enum_blogs_blocks_container_margin_top" DEFAULT 'none',
  	"margin_bottom" "enum_blogs_blocks_container_margin_bottom" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_blogs_blocks_divider_style" DEFAULT 'solid',
  	"thickness" "enum_blogs_blocks_divider_thickness" DEFAULT '1',
  	"color" "enum_blogs_blocks_divider_color" DEFAULT 'zinc-200',
  	"width" "enum_blogs_blocks_divider_width" DEFAULT 'full',
  	"alignment" "enum_blogs_blocks_divider_alignment" DEFAULT 'center',
  	"spacing_top" "enum_blogs_blocks_divider_spacing_top" DEFAULT 'md',
  	"spacing_bottom" "enum_blogs_blocks_divider_spacing_bottom" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height_mobile" numeric DEFAULT 2,
  	"height_tablet" numeric DEFAULT 4,
  	"height_desktop" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "blogs_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "blogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_robots_no_index" boolean,
  	"meta_robots_no_follow" boolean,
  	"meta_robots_no_archive" boolean,
  	"meta_robots_no_snippet" boolean,
  	"meta_canonical" varchar,
  	"meta_structured_type" "enum_blogs_meta_structured_type",
  	"meta_structured_custom_schema" varchar,
  	"meta_structured_author_id" integer,
  	"meta_structured_date_published" timestamp(3) with time zone,
  	"meta_structured_date_modified" timestamp(3) with time zone,
  	"meta_social_twitter_card" "enum_blogs_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"meta_social_twitter_site" varchar,
  	"meta_social_twitter_creator" varchar,
  	"meta_social_facebook_app_id" varchar,
  	"slug" varchar,
  	"published_date" timestamp(3) with time zone,
  	"author_id" integer,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blogs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "blogs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "_blogs_v_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"priority" "enum__blogs_v_blocks_hero_actions_priority" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__blogs_v_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum__blogs_v_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum__blogs_v_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum__blogs_v_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum__blogs_v_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum__blogs_v_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum__blogs_v_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum__blogs_v_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum__blogs_v_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__blogs_v_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"background_color" "enum__blogs_v_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum__blogs_v_blocks_content_columns_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__blogs_v_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum__blogs_v_blocks_content_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__blogs_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__blogs_v_blocks_archive_relation_to",
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__blogs_v_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__blogs_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"filename" varchar,
  	"show_line_numbers" boolean DEFAULT true,
  	"highlight_lines" varchar,
  	"theme" "enum__blogs_v_blocks_code_theme" DEFAULT 'auto',
  	"enable_copy" boolean DEFAULT true,
  	"caption" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_feature_grid_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum__blogs_v_blocks_feature_grid_columns" DEFAULT '3',
  	"style" "enum__blogs_v_blocks_feature_grid_style" DEFAULT 'cards',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_stats_counter_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_stats_counter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum__blogs_v_blocks_stats_counter_layout" DEFAULT 'row',
  	"animate_on_scroll" boolean DEFAULT true,
  	"duration" numeric DEFAULT 2000,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"allow_multiple_open" boolean DEFAULT false,
  	"default_open" varchar,
  	"show_search" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" varchar,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"image_id" integer,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"orientation" "enum__blogs_v_blocks_timeline_orientation" DEFAULT 'vertical',
  	"style" "enum__blogs_v_blocks_timeline_style" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__blogs_v_blocks_cta_variant" DEFAULT 'centered',
  	"heading" varchar,
  	"description" varchar,
  	"rich_text" jsonb,
  	"media_id" integer,
  	"background_color" "enum__blogs_v_blocks_cta_background_color" DEFAULT 'default',
  	"pattern" "enum__blogs_v_blocks_cta_pattern" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Enter your email',
  	"button_text" varchar DEFAULT 'Subscribe',
  	"style" "enum__blogs_v_blocks_newsletter_style" DEFAULT 'inline',
  	"show_privacy_note" boolean DEFAULT true,
  	"privacy_text" varchar DEFAULT 'We respect your privacy. Unsubscribe at any time.',
  	"success_message" varchar DEFAULT 'Thanks for subscribing!',
  	"provider" "enum__blogs_v_blocks_newsletter_provider" DEFAULT 'custom',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_social_proof_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_social_proof_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_social_proof_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_social_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"type" "enum__blogs_v_blocks_social_proof_type" DEFAULT 'logos',
  	"layout" "enum__blogs_v_blocks_social_proof_layout" DEFAULT 'row',
  	"grayscale" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"max_width" "enum__blogs_v_blocks_container_max_width" DEFAULT 'xl',
  	"background_color" "enum__blogs_v_blocks_container_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"padding_top" "enum__blogs_v_blocks_container_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum__blogs_v_blocks_container_padding_bottom" DEFAULT 'md',
  	"margin_top" "enum__blogs_v_blocks_container_margin_top" DEFAULT 'none',
  	"margin_bottom" "enum__blogs_v_blocks_container_margin_bottom" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__blogs_v_blocks_divider_style" DEFAULT 'solid',
  	"thickness" "enum__blogs_v_blocks_divider_thickness" DEFAULT '1',
  	"color" "enum__blogs_v_blocks_divider_color" DEFAULT 'zinc-200',
  	"width" "enum__blogs_v_blocks_divider_width" DEFAULT 'full',
  	"alignment" "enum__blogs_v_blocks_divider_alignment" DEFAULT 'center',
  	"spacing_top" "enum__blogs_v_blocks_divider_spacing_top" DEFAULT 'md',
  	"spacing_bottom" "enum__blogs_v_blocks_divider_spacing_bottom" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height_mobile" numeric DEFAULT 2,
  	"height_tablet" numeric DEFAULT 4,
  	"height_desktop" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_blogs_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_blogs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_keywords" varchar,
  	"version_meta_robots_no_index" boolean,
  	"version_meta_robots_no_follow" boolean,
  	"version_meta_robots_no_archive" boolean,
  	"version_meta_robots_no_snippet" boolean,
  	"version_meta_canonical" varchar,
  	"version_meta_structured_type" "enum__blogs_v_version_meta_structured_type",
  	"version_meta_structured_custom_schema" varchar,
  	"version_meta_structured_author_id" integer,
  	"version_meta_structured_date_published" timestamp(3) with time zone,
  	"version_meta_structured_date_modified" timestamp(3) with time zone,
  	"version_meta_social_twitter_card" "enum__blogs_v_version_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"version_meta_social_twitter_site" varchar,
  	"version_meta_social_twitter_creator" varchar,
  	"version_meta_social_facebook_app_id" varchar,
  	"version_slug" varchar,
  	"version_published_date" timestamp(3) with time zone,
  	"version_author_id" integer,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blogs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_blogs_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "services_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "services_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"priority" "enum_services_blocks_hero_actions_priority" DEFAULT 'primary'
  );
  
  CREATE TABLE "services_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_services_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum_services_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum_services_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum_services_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum_services_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum_services_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum_services_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum_services_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum_services_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_services_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"background_color" "enum_services_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum_services_blocks_content_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "services_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_services_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum_services_blocks_content_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default'
  );
  
  CREATE TABLE "services_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_services_blocks_cta_variant" DEFAULT 'centered',
  	"heading" varchar,
  	"description" varchar,
  	"rich_text" jsonb,
  	"media_id" integer,
  	"background_color" "enum_services_blocks_cta_background_color" DEFAULT 'default',
  	"pattern" "enum_services_blocks_cta_pattern" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_services_grid_services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar
  );
  
  CREATE TABLE "services_blocks_services_grid_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"highlighted" boolean DEFAULT false
  );
  
  CREATE TABLE "services_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum_services_blocks_services_grid_columns" DEFAULT '3',
  	"style" "enum_services_blocks_services_grid_style" DEFAULT 'cards',
  	"show_icons" boolean DEFAULT true,
  	"cta_text" varchar,
  	"cta_link_link_type" "typ" DEFAULT 'reference',
  	"cta_link_link_new_tab" boolean,
  	"cta_link_link_url" varchar,
  	"cta_link_link_appearance" "app" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_tech_stack_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"icon_id" integer,
  	"icon_name" varchar,
  	"category" "enum_services_blocks_tech_stack_technologies_category",
  	"description" varchar,
  	"proficiency" "enum_services_blocks_tech_stack_technologies_proficiency",
  	"years_experience" numeric
  );
  
  CREATE TABLE "services_blocks_tech_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_services_blocks_tech_stack_layout" DEFAULT 'grid',
  	"show_descriptions" boolean DEFAULT false,
  	"enable_filtering" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"details" varchar
  );
  
  CREATE TABLE "services_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_services_blocks_process_steps_layout" DEFAULT 'vertical',
  	"style" "enum_services_blocks_process_steps_style" DEFAULT 'numbered',
  	"show_connectors" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_pricing_table_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"included" boolean DEFAULT true,
  	"tooltip" varchar
  );
  
  CREATE TABLE "services_blocks_pricing_table_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"price" numeric,
  	"currency" varchar DEFAULT 'USD',
  	"period" "enum_services_blocks_pricing_table_tiers_period" DEFAULT 'month',
  	"highlighted" boolean DEFAULT false,
  	"badge" varchar,
  	"cta_text" varchar DEFAULT 'Get Started',
  	"cta_link_link_type" "typ" DEFAULT 'reference',
  	"cta_link_link_new_tab" boolean,
  	"cta_link_link_url" varchar,
  	"cta_link_link_appearance" "app" DEFAULT 'default'
  );
  
  CREATE TABLE "services_blocks_pricing_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"billing_period" "enum_services_blocks_pricing_table_billing_period" DEFAULT 'monthly',
  	"show_comparison" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_testimonial_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"company" varchar,
  	"avatar_id" integer,
  	"rating" numeric,
  	"date" varchar,
  	"project_type" varchar
  );
  
  CREATE TABLE "services_blocks_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_services_blocks_testimonial_layout" DEFAULT 'grid',
  	"show_ratings" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_feature_grid_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "services_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum_services_blocks_feature_grid_columns" DEFAULT '3',
  	"style" "enum_services_blocks_feature_grid_style" DEFAULT 'cards',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_stats_counter_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"description" varchar,
  	"icon" varchar
  );
  
  CREATE TABLE "services_blocks_stats_counter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum_services_blocks_stats_counter_layout" DEFAULT 'row',
  	"animate_on_scroll" boolean DEFAULT true,
  	"duration" numeric DEFAULT 2000,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category" varchar
  );
  
  CREATE TABLE "services_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"allow_multiple_open" boolean DEFAULT false,
  	"default_open" varchar,
  	"show_search" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_services_blocks_contact_form_layout" DEFAULT 'single',
  	"form_id" integer,
  	"show_contact_info" boolean DEFAULT false,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_address" varchar,
  	"contact_info_hours" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Enter your email',
  	"button_text" varchar DEFAULT 'Subscribe',
  	"style" "enum_services_blocks_newsletter_style" DEFAULT 'inline',
  	"show_privacy_note" boolean DEFAULT true,
  	"privacy_text" varchar DEFAULT 'We respect your privacy. Unsubscribe at any time.',
  	"success_message" varchar DEFAULT 'Thanks for subscribing!',
  	"provider" "enum_services_blocks_newsletter_provider" DEFAULT 'custom',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_social_proof_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "services_blocks_social_proof_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "services_blocks_social_proof_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar
  );
  
  CREATE TABLE "services_blocks_social_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"type" "enum_services_blocks_social_proof_type" DEFAULT 'logos',
  	"layout" "enum_services_blocks_social_proof_layout" DEFAULT 'row',
  	"grayscale" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"max_width" "enum_services_blocks_container_max_width" DEFAULT 'xl',
  	"background_color" "enum_services_blocks_container_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"padding_top" "enum_services_blocks_container_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum_services_blocks_container_padding_bottom" DEFAULT 'md',
  	"margin_top" "enum_services_blocks_container_margin_top" DEFAULT 'none',
  	"margin_bottom" "enum_services_blocks_container_margin_bottom" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_services_blocks_divider_style" DEFAULT 'solid',
  	"thickness" "enum_services_blocks_divider_thickness" DEFAULT '1',
  	"color" "enum_services_blocks_divider_color" DEFAULT 'zinc-200',
  	"width" "enum_services_blocks_divider_width" DEFAULT 'full',
  	"alignment" "enum_services_blocks_divider_alignment" DEFAULT 'center',
  	"spacing_top" "enum_services_blocks_divider_spacing_top" DEFAULT 'md',
  	"spacing_bottom" "enum_services_blocks_divider_spacing_bottom" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "services_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height_mobile" numeric DEFAULT 2,
  	"height_tablet" numeric DEFAULT 4,
  	"height_desktop" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_robots_no_index" boolean,
  	"meta_robots_no_follow" boolean,
  	"meta_robots_no_archive" boolean,
  	"meta_robots_no_snippet" boolean,
  	"meta_canonical" varchar,
  	"meta_structured_type" "enum_services_meta_structured_type",
  	"meta_structured_custom_schema" varchar,
  	"meta_structured_author_id" integer,
  	"meta_structured_date_published" timestamp(3) with time zone,
  	"meta_structured_date_modified" timestamp(3) with time zone,
  	"meta_social_twitter_card" "enum_services_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"meta_social_twitter_site" varchar,
  	"meta_social_twitter_creator" varchar,
  	"meta_social_facebook_app_id" varchar,
  	"slug" varchar,
  	"service_type" "enum_services_service_type",
  	"featured" boolean DEFAULT false,
  	"pricing_starting_price" numeric,
  	"pricing_currency" "enum_services_pricing_currency" DEFAULT 'USD',
  	"pricing_pricing_model" "enum_services_pricing_pricing_model" DEFAULT 'custom',
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "_services_v_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"priority" "enum__services_v_blocks_hero_actions_priority" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__services_v_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum__services_v_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum__services_v_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum__services_v_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum__services_v_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum__services_v_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum__services_v_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum__services_v_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum__services_v_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__services_v_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"background_color" "enum__services_v_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum__services_v_blocks_content_columns_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__services_v_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum__services_v_blocks_content_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__services_v_blocks_cta_variant" DEFAULT 'centered',
  	"heading" varchar,
  	"description" varchar,
  	"rich_text" jsonb,
  	"media_id" integer,
  	"background_color" "enum__services_v_blocks_cta_background_color" DEFAULT 'default',
  	"pattern" "enum__services_v_blocks_cta_pattern" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_services_grid_services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"feature" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_services_grid_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"highlighted" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_services_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum__services_v_blocks_services_grid_columns" DEFAULT '3',
  	"style" "enum__services_v_blocks_services_grid_style" DEFAULT 'cards',
  	"show_icons" boolean DEFAULT true,
  	"cta_text" varchar,
  	"cta_link_link_type" "typ" DEFAULT 'reference',
  	"cta_link_link_new_tab" boolean,
  	"cta_link_link_url" varchar,
  	"cta_link_link_appearance" "app" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_tech_stack_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"icon_id" integer,
  	"icon_name" varchar,
  	"category" "enum__services_v_blocks_tech_stack_technologies_category",
  	"description" varchar,
  	"proficiency" "enum__services_v_blocks_tech_stack_technologies_proficiency",
  	"years_experience" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_tech_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__services_v_blocks_tech_stack_layout" DEFAULT 'grid',
  	"show_descriptions" boolean DEFAULT false,
  	"enable_filtering" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_process_steps_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"duration" varchar,
  	"details" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__services_v_blocks_process_steps_layout" DEFAULT 'vertical',
  	"style" "enum__services_v_blocks_process_steps_style" DEFAULT 'numbered',
  	"show_connectors" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_pricing_table_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"included" boolean DEFAULT true,
  	"tooltip" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_pricing_table_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"price" numeric,
  	"currency" varchar DEFAULT 'USD',
  	"period" "enum__services_v_blocks_pricing_table_tiers_period" DEFAULT 'month',
  	"highlighted" boolean DEFAULT false,
  	"badge" varchar,
  	"cta_text" varchar DEFAULT 'Get Started',
  	"cta_link_link_type" "typ" DEFAULT 'reference',
  	"cta_link_link_new_tab" boolean,
  	"cta_link_link_url" varchar,
  	"cta_link_link_appearance" "app" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_pricing_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"billing_period" "enum__services_v_blocks_pricing_table_billing_period" DEFAULT 'monthly',
  	"show_comparison" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_testimonial_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"role" varchar,
  	"company" varchar,
  	"avatar_id" integer,
  	"rating" numeric,
  	"date" varchar,
  	"project_type" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum__services_v_blocks_testimonial_layout" DEFAULT 'grid',
  	"show_ratings" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_feature_grid_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"description" varchar,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"columns" "enum__services_v_blocks_feature_grid_columns" DEFAULT '3',
  	"style" "enum__services_v_blocks_feature_grid_style" DEFAULT 'cards',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_stats_counter_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"prefix" varchar,
  	"suffix" varchar,
  	"label" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_stats_counter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"layout" "enum__services_v_blocks_stats_counter_layout" DEFAULT 'row',
  	"animate_on_scroll" boolean DEFAULT true,
  	"duration" numeric DEFAULT 2000,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"allow_multiple_open" boolean DEFAULT false,
  	"default_open" varchar,
  	"show_search" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__services_v_blocks_contact_form_layout" DEFAULT 'single',
  	"form_id" integer,
  	"show_contact_info" boolean DEFAULT false,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_address" varchar,
  	"contact_info_hours" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"placeholder" varchar DEFAULT 'Enter your email',
  	"button_text" varchar DEFAULT 'Subscribe',
  	"style" "enum__services_v_blocks_newsletter_style" DEFAULT 'inline',
  	"show_privacy_note" boolean DEFAULT true,
  	"privacy_text" varchar DEFAULT 'We respect your privacy. Unsubscribe at any time.',
  	"success_message" varchar DEFAULT 'Thanks for subscribing!',
  	"provider" "enum__services_v_blocks_newsletter_provider" DEFAULT 'custom',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_social_proof_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_social_proof_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_social_proof_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_blocks_social_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"type" "enum__services_v_blocks_social_proof_type" DEFAULT 'logos',
  	"layout" "enum__services_v_blocks_social_proof_layout" DEFAULT 'row',
  	"grayscale" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"max_width" "enum__services_v_blocks_container_max_width" DEFAULT 'xl',
  	"background_color" "enum__services_v_blocks_container_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"padding_top" "enum__services_v_blocks_container_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum__services_v_blocks_container_padding_bottom" DEFAULT 'md',
  	"margin_top" "enum__services_v_blocks_container_margin_top" DEFAULT 'none',
  	"margin_bottom" "enum__services_v_blocks_container_margin_bottom" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__services_v_blocks_divider_style" DEFAULT 'solid',
  	"thickness" "enum__services_v_blocks_divider_thickness" DEFAULT '1',
  	"color" "enum__services_v_blocks_divider_color" DEFAULT 'zinc-200',
  	"width" "enum__services_v_blocks_divider_width" DEFAULT 'full',
  	"alignment" "enum__services_v_blocks_divider_alignment" DEFAULT 'center',
  	"spacing_top" "enum__services_v_blocks_divider_spacing_top" DEFAULT 'md',
  	"spacing_bottom" "enum__services_v_blocks_divider_spacing_bottom" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height_mobile" numeric DEFAULT 2,
  	"height_tablet" numeric DEFAULT 4,
  	"height_desktop" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_keywords" varchar,
  	"version_meta_robots_no_index" boolean,
  	"version_meta_robots_no_follow" boolean,
  	"version_meta_robots_no_archive" boolean,
  	"version_meta_robots_no_snippet" boolean,
  	"version_meta_canonical" varchar,
  	"version_meta_structured_type" "enum__services_v_version_meta_structured_type",
  	"version_meta_structured_custom_schema" varchar,
  	"version_meta_structured_author_id" integer,
  	"version_meta_structured_date_published" timestamp(3) with time zone,
  	"version_meta_structured_date_modified" timestamp(3) with time zone,
  	"version_meta_social_twitter_card" "enum__services_v_version_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"version_meta_social_twitter_site" varchar,
  	"version_meta_social_twitter_creator" varchar,
  	"version_meta_social_facebook_app_id" varchar,
  	"version_slug" varchar,
  	"version_service_type" "enum__services_v_version_service_type",
  	"version_featured" boolean DEFAULT false,
  	"version_pricing_starting_price" numeric,
  	"version_pricing_currency" "enum__services_v_version_pricing_currency" DEFAULT 'USD',
  	"version_pricing_pricing_model" "enum__services_v_version_pricing_pricing_model" DEFAULT 'custom',
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_services_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "legal_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_legal_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"background_color" "enum_legal_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum_legal_blocks_content_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "legal_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_legal_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum_legal_blocks_content_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "legal_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_legal_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "legal_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category" varchar
  );
  
  CREATE TABLE "legal_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"allow_multiple_open" boolean DEFAULT false,
  	"default_open" varchar,
  	"show_search" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "legal_blocks_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"max_width" "enum_legal_blocks_container_max_width" DEFAULT 'xl',
  	"background_color" "enum_legal_blocks_container_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"padding_top" "enum_legal_blocks_container_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum_legal_blocks_container_padding_bottom" DEFAULT 'md',
  	"margin_top" "enum_legal_blocks_container_margin_top" DEFAULT 'none',
  	"margin_bottom" "enum_legal_blocks_container_margin_bottom" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "legal_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_legal_blocks_divider_style" DEFAULT 'solid',
  	"thickness" "enum_legal_blocks_divider_thickness" DEFAULT '1',
  	"color" "enum_legal_blocks_divider_color" DEFAULT 'zinc-200',
  	"width" "enum_legal_blocks_divider_width" DEFAULT 'full',
  	"alignment" "enum_legal_blocks_divider_alignment" DEFAULT 'center',
  	"spacing_top" "enum_legal_blocks_divider_spacing_top" DEFAULT 'md',
  	"spacing_bottom" "enum_legal_blocks_divider_spacing_bottom" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "legal_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height_mobile" numeric DEFAULT 2,
  	"height_tablet" numeric DEFAULT 4,
  	"height_desktop" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "legal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_robots_no_index" boolean,
  	"meta_robots_no_follow" boolean,
  	"meta_robots_no_archive" boolean,
  	"meta_robots_no_snippet" boolean,
  	"meta_canonical" varchar,
  	"meta_structured_type" "enum_legal_meta_structured_type",
  	"meta_structured_custom_schema" varchar,
  	"meta_structured_author_id" integer,
  	"meta_structured_date_published" timestamp(3) with time zone,
  	"meta_structured_date_modified" timestamp(3) with time zone,
  	"meta_social_twitter_card" "enum_legal_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"meta_social_twitter_site" varchar,
  	"meta_social_twitter_creator" varchar,
  	"meta_social_facebook_app_id" varchar,
  	"slug" varchar,
  	"document_type" "enum_legal_document_type",
  	"effective_date" timestamp(3) with time zone,
  	"last_updated" timestamp(3) with time zone,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_legal_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "legal_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "_legal_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__legal_v_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"background_color" "enum__legal_v_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum__legal_v_blocks_content_columns_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_legal_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__legal_v_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum__legal_v_blocks_content_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_legal_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__legal_v_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_legal_v_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_legal_v_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"allow_multiple_open" boolean DEFAULT false,
  	"default_open" varchar,
  	"show_search" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_legal_v_blocks_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"max_width" "enum__legal_v_blocks_container_max_width" DEFAULT 'xl',
  	"background_color" "enum__legal_v_blocks_container_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"padding_top" "enum__legal_v_blocks_container_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum__legal_v_blocks_container_padding_bottom" DEFAULT 'md',
  	"margin_top" "enum__legal_v_blocks_container_margin_top" DEFAULT 'none',
  	"margin_bottom" "enum__legal_v_blocks_container_margin_bottom" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_legal_v_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__legal_v_blocks_divider_style" DEFAULT 'solid',
  	"thickness" "enum__legal_v_blocks_divider_thickness" DEFAULT '1',
  	"color" "enum__legal_v_blocks_divider_color" DEFAULT 'zinc-200',
  	"width" "enum__legal_v_blocks_divider_width" DEFAULT 'full',
  	"alignment" "enum__legal_v_blocks_divider_alignment" DEFAULT 'center',
  	"spacing_top" "enum__legal_v_blocks_divider_spacing_top" DEFAULT 'md',
  	"spacing_bottom" "enum__legal_v_blocks_divider_spacing_bottom" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_legal_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height_mobile" numeric DEFAULT 2,
  	"height_tablet" numeric DEFAULT 4,
  	"height_desktop" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_legal_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_keywords" varchar,
  	"version_meta_robots_no_index" boolean,
  	"version_meta_robots_no_follow" boolean,
  	"version_meta_robots_no_archive" boolean,
  	"version_meta_robots_no_snippet" boolean,
  	"version_meta_canonical" varchar,
  	"version_meta_structured_type" "enum__legal_v_version_meta_structured_type",
  	"version_meta_structured_custom_schema" varchar,
  	"version_meta_structured_author_id" integer,
  	"version_meta_structured_date_published" timestamp(3) with time zone,
  	"version_meta_structured_date_modified" timestamp(3) with time zone,
  	"version_meta_social_twitter_card" "enum__legal_v_version_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"version_meta_social_twitter_site" varchar,
  	"version_meta_social_twitter_creator" varchar,
  	"version_meta_social_facebook_app_id" varchar,
  	"version_slug" varchar,
  	"version_document_type" "enum__legal_v_version_document_type",
  	"version_effective_date" timestamp(3) with time zone,
  	"version_last_updated" timestamp(3) with time zone,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__legal_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_legal_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "contacts_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "contacts_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"priority" "enum_contacts_blocks_hero_actions_priority" DEFAULT 'primary'
  );
  
  CREATE TABLE "contacts_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_contacts_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum_contacts_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum_contacts_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum_contacts_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum_contacts_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum_contacts_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum_contacts_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum_contacts_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum_contacts_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_contacts_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"background_color" "enum_contacts_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum_contacts_blocks_content_columns_padding" DEFAULT 'none'
  );
  
  CREATE TABLE "contacts_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gap" "enum_contacts_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum_contacts_blocks_content_alignment" DEFAULT 'top',
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum_contacts_blocks_contact_form_layout" DEFAULT 'single',
  	"form_id" integer,
  	"show_contact_info" boolean DEFAULT false,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_address" varchar,
  	"contact_info_hours" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_blocks_social_proof_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "contacts_blocks_social_proof_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "contacts_blocks_social_proof_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar
  );
  
  CREATE TABLE "contacts_blocks_social_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"type" "enum_contacts_blocks_social_proof_type" DEFAULT 'logos',
  	"layout" "enum_contacts_blocks_social_proof_layout" DEFAULT 'row',
  	"grayscale" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category" varchar
  );
  
  CREATE TABLE "contacts_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"allow_multiple_open" boolean DEFAULT false,
  	"default_open" varchar,
  	"show_search" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_blocks_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"max_width" "enum_contacts_blocks_container_max_width" DEFAULT 'xl',
  	"background_color" "enum_contacts_blocks_container_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"padding_top" "enum_contacts_blocks_container_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum_contacts_blocks_container_padding_bottom" DEFAULT 'md',
  	"margin_top" "enum_contacts_blocks_container_margin_top" DEFAULT 'none',
  	"margin_bottom" "enum_contacts_blocks_container_margin_bottom" DEFAULT 'none',
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_contacts_blocks_divider_style" DEFAULT 'solid',
  	"thickness" "enum_contacts_blocks_divider_thickness" DEFAULT '1',
  	"color" "enum_contacts_blocks_divider_color" DEFAULT 'zinc-200',
  	"width" "enum_contacts_blocks_divider_width" DEFAULT 'full',
  	"alignment" "enum_contacts_blocks_divider_alignment" DEFAULT 'center',
  	"spacing_top" "enum_contacts_blocks_divider_spacing_top" DEFAULT 'md',
  	"spacing_bottom" "enum_contacts_blocks_divider_spacing_bottom" DEFAULT 'md',
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height_mobile" numeric DEFAULT 2,
  	"height_tablet" numeric DEFAULT 4,
  	"height_desktop" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "contacts_contact_info_sections" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_contacts_contact_info_sections",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"purpose" "enum_contacts_purpose",
  	"form_id" integer,
  	"display_contact_info" boolean DEFAULT true,
  	"show_form_above_content" boolean DEFAULT false,
  	"sidebar_enable_sidebar" boolean DEFAULT false,
  	"sidebar_content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_robots_no_index" boolean,
  	"meta_robots_no_follow" boolean,
  	"meta_robots_no_archive" boolean,
  	"meta_robots_no_snippet" boolean,
  	"meta_canonical" varchar,
  	"meta_structured_type" "enum_contacts_meta_structured_type",
  	"meta_structured_custom_schema" varchar,
  	"meta_structured_author_id" integer,
  	"meta_structured_date_published" timestamp(3) with time zone,
  	"meta_structured_date_modified" timestamp(3) with time zone,
  	"meta_social_twitter_card" "enum_contacts_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"meta_social_twitter_site" varchar,
  	"meta_social_twitter_creator" varchar,
  	"meta_social_facebook_app_id" varchar,
  	"slug" varchar,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_contacts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "contacts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "_contacts_v_blocks_hero_gradient_config_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_hero_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_link_type" "typ" DEFAULT 'reference',
  	"link_link_new_tab" boolean,
  	"link_link_url" varchar,
  	"link_link_label" varchar,
  	"link_link_appearance" "app" DEFAULT 'default',
  	"priority" "enum__contacts_v_blocks_hero_actions_priority" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__contacts_v_blocks_hero_variant" DEFAULT 'default',
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"media_id" integer,
  	"video_url" varchar,
  	"code_snippet_language" "enum__contacts_v_blocks_hero_code_snippet_language" DEFAULT 'javascript',
  	"code_snippet_code" varchar,
  	"code_snippet_theme" "enum__contacts_v_blocks_hero_code_snippet_theme" DEFAULT 'dark',
  	"split_layout_content_side" "enum__contacts_v_blocks_hero_split_layout_content_side" DEFAULT 'left',
  	"split_layout_media_type" "enum__contacts_v_blocks_hero_split_layout_media_type" DEFAULT 'image',
  	"gradient_config_animation" "enum__contacts_v_blocks_hero_gradient_config_animation" DEFAULT 'wave',
  	"settings_theme" "enum__contacts_v_blocks_hero_settings_theme" DEFAULT 'auto',
  	"settings_height" "enum__contacts_v_blocks_hero_settings_height" DEFAULT 'large',
  	"settings_enable_parallax" boolean DEFAULT false,
  	"settings_overlay_enabled" boolean DEFAULT false,
  	"settings_overlay_opacity" numeric DEFAULT 40,
  	"settings_overlay_color" "enum__contacts_v_blocks_hero_settings_overlay_color" DEFAULT 'black',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__contacts_v_blocks_content_columns_width" DEFAULT 'full',
  	"content" jsonb,
  	"enable_link" boolean,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "app" DEFAULT 'default',
  	"background_color" "enum__contacts_v_blocks_content_columns_background_color" DEFAULT 'none',
  	"padding" "enum__contacts_v_blocks_content_columns_padding" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gap" "enum__contacts_v_blocks_content_gap" DEFAULT 'medium',
  	"alignment" "enum__contacts_v_blocks_content_alignment" DEFAULT 'top',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"layout" "enum__contacts_v_blocks_contact_form_layout" DEFAULT 'single',
  	"form_id" integer,
  	"show_contact_info" boolean DEFAULT false,
  	"contact_info_email" varchar,
  	"contact_info_phone" varchar,
  	"contact_info_address" varchar,
  	"contact_info_hours" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_social_proof_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"name" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_social_proof_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_social_proof_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_social_proof" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"type" "enum__contacts_v_blocks_social_proof_type" DEFAULT 'logos',
  	"layout" "enum__contacts_v_blocks_social_proof_layout" DEFAULT 'row',
  	"grayscale" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_faq_accordion_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"category" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_faq_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"allow_multiple_open" boolean DEFAULT false,
  	"default_open" varchar,
  	"show_search" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_container" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"max_width" "enum__contacts_v_blocks_container_max_width" DEFAULT 'xl',
  	"background_color" "enum__contacts_v_blocks_container_background_color" DEFAULT 'none',
  	"background_image_id" integer,
  	"padding_top" "enum__contacts_v_blocks_container_padding_top" DEFAULT 'md',
  	"padding_bottom" "enum__contacts_v_blocks_container_padding_bottom" DEFAULT 'md',
  	"margin_top" "enum__contacts_v_blocks_container_margin_top" DEFAULT 'none',
  	"margin_bottom" "enum__contacts_v_blocks_container_margin_bottom" DEFAULT 'none',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__contacts_v_blocks_divider_style" DEFAULT 'solid',
  	"thickness" "enum__contacts_v_blocks_divider_thickness" DEFAULT '1',
  	"color" "enum__contacts_v_blocks_divider_color" DEFAULT 'zinc-200',
  	"width" "enum__contacts_v_blocks_divider_width" DEFAULT 'full',
  	"alignment" "enum__contacts_v_blocks_divider_alignment" DEFAULT 'center',
  	"spacing_top" "enum__contacts_v_blocks_divider_spacing_top" DEFAULT 'md',
  	"spacing_bottom" "enum__contacts_v_blocks_divider_spacing_bottom" DEFAULT 'md',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height_mobile" numeric DEFAULT 2,
  	"height_tablet" numeric DEFAULT 4,
  	"height_desktop" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_contacts_v_version_contact_info_sections" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__contacts_v_version_contact_info_sections",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_contacts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_purpose" "enum__contacts_v_version_purpose",
  	"version_form_id" integer,
  	"version_display_contact_info" boolean DEFAULT true,
  	"version_show_form_above_content" boolean DEFAULT false,
  	"version_sidebar_enable_sidebar" boolean DEFAULT false,
  	"version_sidebar_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_keywords" varchar,
  	"version_meta_robots_no_index" boolean,
  	"version_meta_robots_no_follow" boolean,
  	"version_meta_robots_no_archive" boolean,
  	"version_meta_robots_no_snippet" boolean,
  	"version_meta_canonical" varchar,
  	"version_meta_structured_type" "enum__contacts_v_version_meta_structured_type",
  	"version_meta_structured_custom_schema" varchar,
  	"version_meta_structured_author_id" integer,
  	"version_meta_structured_date_published" timestamp(3) with time zone,
  	"version_meta_structured_date_modified" timestamp(3) with time zone,
  	"version_meta_social_twitter_card" "enum__contacts_v_version_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"version_meta_social_twitter_site" varchar,
  	"version_meta_social_twitter_creator" varchar,
  	"version_meta_social_facebook_app_id" varchar,
  	"version_slug" varchar,
  	"version_created_by_id" integer,
  	"version_updated_by_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__contacts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_contacts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "analytics_data" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cache_key" varchar,
  	"cache_timestamp" varchar,
  	"data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"label" varchar,
  	"width" numeric,
  	"default_value" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar,
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb
  );
  
  CREATE TABLE "forms_email_notifications_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_url" varchar,
  	"email_notifications_enabled" boolean DEFAULT false,
  	"email_notifications_subject" varchar DEFAULT 'New Form Submission',
  	"email_notifications_reply_to" varchar,
  	"email_notifications_include_submission_data" boolean DEFAULT true,
  	"validation_settings_enable_honeypot" boolean DEFAULT true,
  	"validation_settings_enable_rate_limit" boolean DEFAULT true,
  	"validation_settings_rate_limit_window" numeric DEFAULT 60,
  	"validation_settings_max_submissions_per_window" numeric DEFAULT 5,
  	"validation_settings_require_authentication" boolean DEFAULT false,
  	"response_settings_success_message" varchar DEFAULT 'Thank you for your submission!',
  	"response_settings_error_message" varchar DEFAULT 'There was an error submitting your form. Please try again.',
  	"response_settings_redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer,
  	"analytics_data_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_description" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "header_featured" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "header_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_header_nav_items_style" DEFAULT 'default',
  	"default_link_link_type" "typ" DEFAULT 'reference',
  	"default_link_link_new_tab" boolean,
  	"default_link_link_url" varchar,
  	"default_link_link_label" varchar,
  	"default_link_description" varchar,
  	"featured_link_tag" varchar,
  	"featured_link_label" varchar,
  	"list_links_tag" varchar
  );
  
  CREATE TABLE "header_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"enable_direct_link" boolean,
  	"enable_dropdown" boolean,
  	"direct_link_link_type" "typ" DEFAULT 'reference',
  	"direct_link_link_new_tab" boolean,
  	"direct_link_link_url" varchar,
  	"dropdown_description" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"menu_cta_type" "typ" DEFAULT 'reference',
  	"menu_cta_new_tab" boolean,
  	"menu_cta_url" varchar,
  	"menu_cta_label" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_robots_no_index" boolean,
  	"meta_robots_no_follow" boolean,
  	"meta_robots_no_archive" boolean,
  	"meta_robots_no_snippet" boolean,
  	"meta_canonical" varchar,
  	"meta_structured_type" "enum_header_meta_structured_type",
  	"meta_structured_custom_schema" varchar,
  	"meta_structured_author_id" integer,
  	"meta_structured_date_published" timestamp(3) with time zone,
  	"meta_structured_date_modified" timestamp(3) with time zone,
  	"meta_social_twitter_card" "enum_header_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"meta_social_twitter_site" varchar,
  	"meta_social_twitter_creator" varchar,
  	"meta_social_facebook_app_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "footer_columns_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "typ" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_keywords" varchar,
  	"meta_robots_no_index" boolean,
  	"meta_robots_no_follow" boolean,
  	"meta_robots_no_archive" boolean,
  	"meta_robots_no_snippet" boolean,
  	"meta_canonical" varchar,
  	"meta_structured_type" "enum_footer_meta_structured_type",
  	"meta_structured_custom_schema" varchar,
  	"meta_structured_author_id" integer,
  	"meta_structured_date_published" timestamp(3) with time zone,
  	"meta_structured_date_modified" timestamp(3) with time zone,
  	"meta_social_twitter_card" "enum_footer_meta_social_twitter_card" DEFAULT 'summary_large_image',
  	"meta_social_twitter_site" varchar,
  	"meta_social_twitter_creator" varchar,
  	"meta_social_facebook_app_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"blogs_id" integer,
  	"services_id" integer,
  	"legal_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "contact_social_media_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_contact_social_media_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_gradient_config_colors" ADD CONSTRAINT "pages_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_actions" ADD CONSTRAINT "pages_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner" ADD CONSTRAINT "pages_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_code" ADD CONSTRAINT "pages_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid_services_features" ADD CONSTRAINT "pages_blocks_services_grid_services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_grid_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid_services" ADD CONSTRAINT "pages_blocks_services_grid_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_services_grid" ADD CONSTRAINT "pages_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tech_stack_technologies" ADD CONSTRAINT "pages_blocks_tech_stack_technologies_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_tech_stack_technologies" ADD CONSTRAINT "pages_blocks_tech_stack_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_tech_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_tech_stack" ADD CONSTRAINT "pages_blocks_tech_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps_steps" ADD CONSTRAINT "pages_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_process_steps" ADD CONSTRAINT "pages_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_table_tiers_features" ADD CONSTRAINT "pages_blocks_pricing_table_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_table_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_table_tiers" ADD CONSTRAINT "pages_blocks_pricing_table_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_table" ADD CONSTRAINT "pages_blocks_pricing_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_showcase_projects_technologies" ADD CONSTRAINT "pages_blocks_project_showcase_projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_project_showcase_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_showcase_projects" ADD CONSTRAINT "pages_blocks_project_showcase_projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_showcase_projects" ADD CONSTRAINT "pages_blocks_project_showcase_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_project_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_showcase_filter_categories" ADD CONSTRAINT "pages_blocks_project_showcase_filter_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_project_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_showcase" ADD CONSTRAINT "pages_blocks_project_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study_approach_steps" ADD CONSTRAINT "pages_blocks_case_study_approach_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study_solution_technologies" ADD CONSTRAINT "pages_blocks_case_study_solution_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study_results_metrics" ADD CONSTRAINT "pages_blocks_case_study_results_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study" ADD CONSTRAINT "pages_blocks_case_study_challenge_image_id_media_id_fk" FOREIGN KEY ("challenge_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study" ADD CONSTRAINT "pages_blocks_case_study_solution_image_id_media_id_fk" FOREIGN KEY ("solution_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study" ADD CONSTRAINT "pages_blocks_case_study_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_before_after" ADD CONSTRAINT "pages_blocks_before_after_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_before_after" ADD CONSTRAINT "pages_blocks_before_after_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_before_after" ADD CONSTRAINT "pages_blocks_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_testimonials" ADD CONSTRAINT "pages_blocks_testimonial_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_testimonials" ADD CONSTRAINT "pages_blocks_testimonial_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial" ADD CONSTRAINT "pages_blocks_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid_features" ADD CONSTRAINT "pages_blocks_feature_grid_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_grid" ADD CONSTRAINT "pages_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_counter_stats" ADD CONSTRAINT "pages_blocks_stats_counter_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_counter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_counter" ADD CONSTRAINT "pages_blocks_stats_counter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_accordion_faqs" ADD CONSTRAINT "pages_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_accordion" ADD CONSTRAINT "pages_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items" ADD CONSTRAINT "pages_blocks_timeline_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_items" ADD CONSTRAINT "pages_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_newsletter" ADD CONSTRAINT "pages_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_proof_logos" ADD CONSTRAINT "pages_blocks_social_proof_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_proof_logos" ADD CONSTRAINT "pages_blocks_social_proof_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_proof_stats" ADD CONSTRAINT "pages_blocks_social_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_proof_badges" ADD CONSTRAINT "pages_blocks_social_proof_badges_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_proof_badges" ADD CONSTRAINT "pages_blocks_social_proof_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_social_proof" ADD CONSTRAINT "pages_blocks_social_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_container" ADD CONSTRAINT "pages_blocks_container_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_container" ADD CONSTRAINT "pages_blocks_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_divider" ADD CONSTRAINT "pages_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_breadcrumbs" ADD CONSTRAINT "pages_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_structured_author_id_users_id_fk" FOREIGN KEY ("meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_gradient_config_colors" ADD CONSTRAINT "_pages_v_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_actions" ADD CONSTRAINT "_pages_v_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_banner" ADD CONSTRAINT "_pages_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_code" ADD CONSTRAINT "_pages_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid_services_features" ADD CONSTRAINT "_pages_v_blocks_services_grid_services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services_grid_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid_services" ADD CONSTRAINT "_pages_v_blocks_services_grid_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_services_grid" ADD CONSTRAINT "_pages_v_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tech_stack_technologies" ADD CONSTRAINT "_pages_v_blocks_tech_stack_technologies_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tech_stack_technologies" ADD CONSTRAINT "_pages_v_blocks_tech_stack_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_tech_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_tech_stack" ADD CONSTRAINT "_pages_v_blocks_tech_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_process_steps" ADD CONSTRAINT "_pages_v_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_table_tiers_features" ADD CONSTRAINT "_pages_v_blocks_pricing_table_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_table_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_table_tiers" ADD CONSTRAINT "_pages_v_blocks_pricing_table_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_table" ADD CONSTRAINT "_pages_v_blocks_pricing_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_showcase_projects_technologies" ADD CONSTRAINT "_pages_v_blocks_project_showcase_projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_project_showcase_projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_showcase_projects" ADD CONSTRAINT "_pages_v_blocks_project_showcase_projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_showcase_projects" ADD CONSTRAINT "_pages_v_blocks_project_showcase_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_project_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_showcase_filter_categories" ADD CONSTRAINT "_pages_v_blocks_project_showcase_filter_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_project_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_showcase" ADD CONSTRAINT "_pages_v_blocks_project_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study_approach_steps" ADD CONSTRAINT "_pages_v_blocks_case_study_approach_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study_solution_technologies" ADD CONSTRAINT "_pages_v_blocks_case_study_solution_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study_results_metrics" ADD CONSTRAINT "_pages_v_blocks_case_study_results_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study" ADD CONSTRAINT "_pages_v_blocks_case_study_challenge_image_id_media_id_fk" FOREIGN KEY ("challenge_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study" ADD CONSTRAINT "_pages_v_blocks_case_study_solution_image_id_media_id_fk" FOREIGN KEY ("solution_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study" ADD CONSTRAINT "_pages_v_blocks_case_study_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_before_after" ADD CONSTRAINT "_pages_v_blocks_before_after_before_image_id_media_id_fk" FOREIGN KEY ("before_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_before_after" ADD CONSTRAINT "_pages_v_blocks_before_after_after_image_id_media_id_fk" FOREIGN KEY ("after_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_before_after" ADD CONSTRAINT "_pages_v_blocks_before_after_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonial_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonial_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial" ADD CONSTRAINT "_pages_v_blocks_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid_features" ADD CONSTRAINT "_pages_v_blocks_feature_grid_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_grid" ADD CONSTRAINT "_pages_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_counter_stats" ADD CONSTRAINT "_pages_v_blocks_stats_counter_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_counter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_counter" ADD CONSTRAINT "_pages_v_blocks_stats_counter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_accordion_faqs" ADD CONSTRAINT "_pages_v_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_accordion" ADD CONSTRAINT "_pages_v_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items" ADD CONSTRAINT "_pages_v_blocks_timeline_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_items" ADD CONSTRAINT "_pages_v_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_form" ADD CONSTRAINT "_pages_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter" ADD CONSTRAINT "_pages_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_proof_logos" ADD CONSTRAINT "_pages_v_blocks_social_proof_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_proof_logos" ADD CONSTRAINT "_pages_v_blocks_social_proof_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_proof_stats" ADD CONSTRAINT "_pages_v_blocks_social_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_proof_badges" ADD CONSTRAINT "_pages_v_blocks_social_proof_badges_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_proof_badges" ADD CONSTRAINT "_pages_v_blocks_social_proof_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_social_proof" ADD CONSTRAINT "_pages_v_blocks_social_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_container" ADD CONSTRAINT "_pages_v_blocks_container_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_container" ADD CONSTRAINT "_pages_v_blocks_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_divider" ADD CONSTRAINT "_pages_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_doc_id_pages_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_breadcrumbs" ADD CONSTRAINT "_pages_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_structured_author_id_users_id_fk" FOREIGN KEY ("version_meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_hero_gradient_config_colors" ADD CONSTRAINT "blogs_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_hero_actions" ADD CONSTRAINT "blogs_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_hero" ADD CONSTRAINT "blogs_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_blocks_hero" ADD CONSTRAINT "blogs_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_content_columns" ADD CONSTRAINT "blogs_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_content" ADD CONSTRAINT "blogs_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_media_block" ADD CONSTRAINT "blogs_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_blocks_media_block" ADD CONSTRAINT "blogs_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_archive" ADD CONSTRAINT "blogs_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_banner" ADD CONSTRAINT "blogs_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_code" ADD CONSTRAINT "blogs_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_feature_grid_features" ADD CONSTRAINT "blogs_blocks_feature_grid_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_feature_grid" ADD CONSTRAINT "blogs_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_stats_counter_stats" ADD CONSTRAINT "blogs_blocks_stats_counter_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_stats_counter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_stats_counter" ADD CONSTRAINT "blogs_blocks_stats_counter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_faq_accordion_faqs" ADD CONSTRAINT "blogs_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_faq_accordion" ADD CONSTRAINT "blogs_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_timeline_items" ADD CONSTRAINT "blogs_blocks_timeline_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_blocks_timeline_items" ADD CONSTRAINT "blogs_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_timeline" ADD CONSTRAINT "blogs_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_cta_links" ADD CONSTRAINT "blogs_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_cta" ADD CONSTRAINT "blogs_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_blocks_cta" ADD CONSTRAINT "blogs_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_newsletter" ADD CONSTRAINT "blogs_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_social_proof_logos" ADD CONSTRAINT "blogs_blocks_social_proof_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_blocks_social_proof_logos" ADD CONSTRAINT "blogs_blocks_social_proof_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_social_proof_stats" ADD CONSTRAINT "blogs_blocks_social_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_social_proof_badges" ADD CONSTRAINT "blogs_blocks_social_proof_badges_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_blocks_social_proof_badges" ADD CONSTRAINT "blogs_blocks_social_proof_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_social_proof" ADD CONSTRAINT "blogs_blocks_social_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_container" ADD CONSTRAINT "blogs_blocks_container_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_blocks_container" ADD CONSTRAINT "blogs_blocks_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_divider" ADD CONSTRAINT "blogs_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_blocks_spacer" ADD CONSTRAINT "blogs_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_tags" ADD CONSTRAINT "blogs_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_meta_structured_author_id_users_id_fk" FOREIGN KEY ("meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blogs_rels" ADD CONSTRAINT "blogs_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_hero_gradient_config_colors" ADD CONSTRAINT "_blogs_v_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_hero_actions" ADD CONSTRAINT "_blogs_v_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_hero" ADD CONSTRAINT "_blogs_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_hero" ADD CONSTRAINT "_blogs_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_content_columns" ADD CONSTRAINT "_blogs_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_content" ADD CONSTRAINT "_blogs_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_media_block" ADD CONSTRAINT "_blogs_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_media_block" ADD CONSTRAINT "_blogs_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_archive" ADD CONSTRAINT "_blogs_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_banner" ADD CONSTRAINT "_blogs_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_code" ADD CONSTRAINT "_blogs_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_feature_grid_features" ADD CONSTRAINT "_blogs_v_blocks_feature_grid_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_feature_grid" ADD CONSTRAINT "_blogs_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_stats_counter_stats" ADD CONSTRAINT "_blogs_v_blocks_stats_counter_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_stats_counter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_stats_counter" ADD CONSTRAINT "_blogs_v_blocks_stats_counter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_faq_accordion_faqs" ADD CONSTRAINT "_blogs_v_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_faq_accordion" ADD CONSTRAINT "_blogs_v_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_timeline_items" ADD CONSTRAINT "_blogs_v_blocks_timeline_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_timeline_items" ADD CONSTRAINT "_blogs_v_blocks_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_timeline" ADD CONSTRAINT "_blogs_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_cta_links" ADD CONSTRAINT "_blogs_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_cta" ADD CONSTRAINT "_blogs_v_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_cta" ADD CONSTRAINT "_blogs_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_newsletter" ADD CONSTRAINT "_blogs_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_social_proof_logos" ADD CONSTRAINT "_blogs_v_blocks_social_proof_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_social_proof_logos" ADD CONSTRAINT "_blogs_v_blocks_social_proof_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_social_proof_stats" ADD CONSTRAINT "_blogs_v_blocks_social_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_social_proof_badges" ADD CONSTRAINT "_blogs_v_blocks_social_proof_badges_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_social_proof_badges" ADD CONSTRAINT "_blogs_v_blocks_social_proof_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_social_proof" ADD CONSTRAINT "_blogs_v_blocks_social_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_container" ADD CONSTRAINT "_blogs_v_blocks_container_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_container" ADD CONSTRAINT "_blogs_v_blocks_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_divider" ADD CONSTRAINT "_blogs_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_blocks_spacer" ADD CONSTRAINT "_blogs_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_version_tags" ADD CONSTRAINT "_blogs_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_parent_id_blogs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blogs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_meta_structured_author_id_users_id_fk" FOREIGN KEY ("version_meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v_rels" ADD CONSTRAINT "_blogs_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_blogs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_rels" ADD CONSTRAINT "_blogs_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_rels" ADD CONSTRAINT "_blogs_v_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_rels" ADD CONSTRAINT "_blogs_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_rels" ADD CONSTRAINT "_blogs_v_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_blogs_v_rels" ADD CONSTRAINT "_blogs_v_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_hero_gradient_config_colors" ADD CONSTRAINT "services_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_hero_actions" ADD CONSTRAINT "services_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_hero" ADD CONSTRAINT "services_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_hero" ADD CONSTRAINT "services_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_content_columns" ADD CONSTRAINT "services_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_content" ADD CONSTRAINT "services_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_media_block" ADD CONSTRAINT "services_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_media_block" ADD CONSTRAINT "services_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_cta_links" ADD CONSTRAINT "services_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_cta" ADD CONSTRAINT "services_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_cta" ADD CONSTRAINT "services_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_services_grid_services_features" ADD CONSTRAINT "services_blocks_services_grid_services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_services_grid_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_services_grid_services" ADD CONSTRAINT "services_blocks_services_grid_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_services_grid" ADD CONSTRAINT "services_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_tech_stack_technologies" ADD CONSTRAINT "services_blocks_tech_stack_technologies_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_tech_stack_technologies" ADD CONSTRAINT "services_blocks_tech_stack_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_tech_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_tech_stack" ADD CONSTRAINT "services_blocks_tech_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_process_steps_steps" ADD CONSTRAINT "services_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_process_steps" ADD CONSTRAINT "services_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_pricing_table_tiers_features" ADD CONSTRAINT "services_blocks_pricing_table_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_pricing_table_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_pricing_table_tiers" ADD CONSTRAINT "services_blocks_pricing_table_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_pricing_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_pricing_table" ADD CONSTRAINT "services_blocks_pricing_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_testimonial_testimonials" ADD CONSTRAINT "services_blocks_testimonial_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_testimonial_testimonials" ADD CONSTRAINT "services_blocks_testimonial_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_testimonial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_testimonial" ADD CONSTRAINT "services_blocks_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_feature_grid_features" ADD CONSTRAINT "services_blocks_feature_grid_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_feature_grid" ADD CONSTRAINT "services_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_stats_counter_stats" ADD CONSTRAINT "services_blocks_stats_counter_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_stats_counter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_stats_counter" ADD CONSTRAINT "services_blocks_stats_counter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_faq_accordion_faqs" ADD CONSTRAINT "services_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_faq_accordion" ADD CONSTRAINT "services_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_contact_form" ADD CONSTRAINT "services_blocks_contact_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_contact_form" ADD CONSTRAINT "services_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_newsletter" ADD CONSTRAINT "services_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_social_proof_logos" ADD CONSTRAINT "services_blocks_social_proof_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_social_proof_logos" ADD CONSTRAINT "services_blocks_social_proof_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_social_proof_stats" ADD CONSTRAINT "services_blocks_social_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_social_proof_badges" ADD CONSTRAINT "services_blocks_social_proof_badges_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_social_proof_badges" ADD CONSTRAINT "services_blocks_social_proof_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_social_proof" ADD CONSTRAINT "services_blocks_social_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_container" ADD CONSTRAINT "services_blocks_container_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_blocks_container" ADD CONSTRAINT "services_blocks_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_divider" ADD CONSTRAINT "services_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_blocks_spacer" ADD CONSTRAINT "services_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_meta_structured_author_id_users_id_fk" FOREIGN KEY ("meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_hero_gradient_config_colors" ADD CONSTRAINT "_services_v_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_hero_actions" ADD CONSTRAINT "_services_v_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_hero" ADD CONSTRAINT "_services_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_hero" ADD CONSTRAINT "_services_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_content_columns" ADD CONSTRAINT "_services_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_content" ADD CONSTRAINT "_services_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_media_block" ADD CONSTRAINT "_services_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_media_block" ADD CONSTRAINT "_services_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_cta_links" ADD CONSTRAINT "_services_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_cta" ADD CONSTRAINT "_services_v_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_cta" ADD CONSTRAINT "_services_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_services_grid_services_features" ADD CONSTRAINT "_services_v_blocks_services_grid_services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_services_grid_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_services_grid_services" ADD CONSTRAINT "_services_v_blocks_services_grid_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_services_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_services_grid" ADD CONSTRAINT "_services_v_blocks_services_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_tech_stack_technologies" ADD CONSTRAINT "_services_v_blocks_tech_stack_technologies_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_tech_stack_technologies" ADD CONSTRAINT "_services_v_blocks_tech_stack_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_tech_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_tech_stack" ADD CONSTRAINT "_services_v_blocks_tech_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_process_steps_steps" ADD CONSTRAINT "_services_v_blocks_process_steps_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_process_steps" ADD CONSTRAINT "_services_v_blocks_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_pricing_table_tiers_features" ADD CONSTRAINT "_services_v_blocks_pricing_table_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_pricing_table_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_pricing_table_tiers" ADD CONSTRAINT "_services_v_blocks_pricing_table_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_pricing_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_pricing_table" ADD CONSTRAINT "_services_v_blocks_pricing_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_testimonial_testimonials" ADD CONSTRAINT "_services_v_blocks_testimonial_testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_testimonial_testimonials" ADD CONSTRAINT "_services_v_blocks_testimonial_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_testimonial"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_testimonial" ADD CONSTRAINT "_services_v_blocks_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_feature_grid_features" ADD CONSTRAINT "_services_v_blocks_feature_grid_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_feature_grid" ADD CONSTRAINT "_services_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_stats_counter_stats" ADD CONSTRAINT "_services_v_blocks_stats_counter_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_stats_counter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_stats_counter" ADD CONSTRAINT "_services_v_blocks_stats_counter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_faq_accordion_faqs" ADD CONSTRAINT "_services_v_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_faq_accordion" ADD CONSTRAINT "_services_v_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_contact_form" ADD CONSTRAINT "_services_v_blocks_contact_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_contact_form" ADD CONSTRAINT "_services_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_newsletter" ADD CONSTRAINT "_services_v_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_social_proof_logos" ADD CONSTRAINT "_services_v_blocks_social_proof_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_social_proof_logos" ADD CONSTRAINT "_services_v_blocks_social_proof_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_social_proof_stats" ADD CONSTRAINT "_services_v_blocks_social_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_social_proof_badges" ADD CONSTRAINT "_services_v_blocks_social_proof_badges_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_social_proof_badges" ADD CONSTRAINT "_services_v_blocks_social_proof_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_social_proof" ADD CONSTRAINT "_services_v_blocks_social_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_container" ADD CONSTRAINT "_services_v_blocks_container_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_container" ADD CONSTRAINT "_services_v_blocks_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_divider" ADD CONSTRAINT "_services_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_blocks_spacer" ADD CONSTRAINT "_services_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_meta_structured_author_id_users_id_fk" FOREIGN KEY ("version_meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_rels" ADD CONSTRAINT "_services_v_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_blocks_content_columns" ADD CONSTRAINT "legal_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_blocks_content" ADD CONSTRAINT "legal_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_blocks_banner" ADD CONSTRAINT "legal_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_blocks_faq_accordion_faqs" ADD CONSTRAINT "legal_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_blocks_faq_accordion" ADD CONSTRAINT "legal_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_blocks_container" ADD CONSTRAINT "legal_blocks_container_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_blocks_container" ADD CONSTRAINT "legal_blocks_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_blocks_divider" ADD CONSTRAINT "legal_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_blocks_spacer" ADD CONSTRAINT "legal_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal" ADD CONSTRAINT "legal_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal" ADD CONSTRAINT "legal_meta_structured_author_id_users_id_fk" FOREIGN KEY ("meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal" ADD CONSTRAINT "legal_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal" ADD CONSTRAINT "legal_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "legal_rels" ADD CONSTRAINT "legal_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_content_columns" ADD CONSTRAINT "_legal_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_content" ADD CONSTRAINT "_legal_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_banner" ADD CONSTRAINT "_legal_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_faq_accordion_faqs" ADD CONSTRAINT "_legal_v_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_faq_accordion" ADD CONSTRAINT "_legal_v_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_container" ADD CONSTRAINT "_legal_v_blocks_container_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_container" ADD CONSTRAINT "_legal_v_blocks_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_divider" ADD CONSTRAINT "_legal_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_blocks_spacer" ADD CONSTRAINT "_legal_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v" ADD CONSTRAINT "_legal_v_parent_id_legal_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."legal"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_v" ADD CONSTRAINT "_legal_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_v" ADD CONSTRAINT "_legal_v_version_meta_structured_author_id_users_id_fk" FOREIGN KEY ("version_meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_v" ADD CONSTRAINT "_legal_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_v" ADD CONSTRAINT "_legal_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_legal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_legal_v_rels" ADD CONSTRAINT "_legal_v_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_hero_gradient_config_colors" ADD CONSTRAINT "contacts_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_hero_actions" ADD CONSTRAINT "contacts_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_hero" ADD CONSTRAINT "contacts_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_blocks_hero" ADD CONSTRAINT "contacts_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_content_columns" ADD CONSTRAINT "contacts_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_content" ADD CONSTRAINT "contacts_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_media_block" ADD CONSTRAINT "contacts_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_blocks_media_block" ADD CONSTRAINT "contacts_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_contact_form" ADD CONSTRAINT "contacts_blocks_contact_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_blocks_contact_form" ADD CONSTRAINT "contacts_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_social_proof_logos" ADD CONSTRAINT "contacts_blocks_social_proof_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_blocks_social_proof_logos" ADD CONSTRAINT "contacts_blocks_social_proof_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_social_proof_stats" ADD CONSTRAINT "contacts_blocks_social_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_social_proof_badges" ADD CONSTRAINT "contacts_blocks_social_proof_badges_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_blocks_social_proof_badges" ADD CONSTRAINT "contacts_blocks_social_proof_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_social_proof" ADD CONSTRAINT "contacts_blocks_social_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_faq_accordion_faqs" ADD CONSTRAINT "contacts_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_faq_accordion" ADD CONSTRAINT "contacts_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_container" ADD CONSTRAINT "contacts_blocks_container_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_blocks_container" ADD CONSTRAINT "contacts_blocks_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_divider" ADD CONSTRAINT "contacts_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_blocks_spacer" ADD CONSTRAINT "contacts_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_contact_info_sections" ADD CONSTRAINT "contacts_contact_info_sections_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_meta_structured_author_id_users_id_fk" FOREIGN KEY ("meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts_rels" ADD CONSTRAINT "contacts_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_hero_gradient_config_colors" ADD CONSTRAINT "_contacts_v_blocks_hero_gradient_config_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_hero_actions" ADD CONSTRAINT "_contacts_v_blocks_hero_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_hero" ADD CONSTRAINT "_contacts_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_hero" ADD CONSTRAINT "_contacts_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_content_columns" ADD CONSTRAINT "_contacts_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_content" ADD CONSTRAINT "_contacts_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_media_block" ADD CONSTRAINT "_contacts_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_media_block" ADD CONSTRAINT "_contacts_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_contact_form" ADD CONSTRAINT "_contacts_v_blocks_contact_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_contact_form" ADD CONSTRAINT "_contacts_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_social_proof_logos" ADD CONSTRAINT "_contacts_v_blocks_social_proof_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_social_proof_logos" ADD CONSTRAINT "_contacts_v_blocks_social_proof_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_social_proof_stats" ADD CONSTRAINT "_contacts_v_blocks_social_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_social_proof_badges" ADD CONSTRAINT "_contacts_v_blocks_social_proof_badges_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_social_proof_badges" ADD CONSTRAINT "_contacts_v_blocks_social_proof_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v_blocks_social_proof"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_social_proof" ADD CONSTRAINT "_contacts_v_blocks_social_proof_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_faq_accordion_faqs" ADD CONSTRAINT "_contacts_v_blocks_faq_accordion_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v_blocks_faq_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_faq_accordion" ADD CONSTRAINT "_contacts_v_blocks_faq_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_container" ADD CONSTRAINT "_contacts_v_blocks_container_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_container" ADD CONSTRAINT "_contacts_v_blocks_container_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_divider" ADD CONSTRAINT "_contacts_v_blocks_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_blocks_spacer" ADD CONSTRAINT "_contacts_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_version_contact_info_sections" ADD CONSTRAINT "_contacts_v_version_contact_info_sections_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v" ADD CONSTRAINT "_contacts_v_parent_id_contacts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v" ADD CONSTRAINT "_contacts_v_version_form_id_forms_id_fk" FOREIGN KEY ("version_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v" ADD CONSTRAINT "_contacts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v" ADD CONSTRAINT "_contacts_v_version_meta_structured_author_id_users_id_fk" FOREIGN KEY ("version_meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v" ADD CONSTRAINT "_contacts_v_version_created_by_id_users_id_fk" FOREIGN KEY ("version_created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v" ADD CONSTRAINT "_contacts_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_contacts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contacts_v_rels" ADD CONSTRAINT "_contacts_v_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_email_notifications_recipients" ADD CONSTRAINT "forms_email_notifications_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_data_fk" FOREIGN KEY ("analytics_data_id") REFERENCES "public"."analytics_data"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_description" ADD CONSTRAINT "header_description_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_featured" ADD CONSTRAINT "header_featured_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_list" ADD CONSTRAINT "header_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_tabs" ADD CONSTRAINT "header_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_meta_structured_author_id_users_id_fk" FOREIGN KEY ("meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_nav_items" ADD CONSTRAINT "footer_columns_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_meta_structured_author_id_users_id_fk" FOREIGN KEY ("meta_structured_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_legal_fk" FOREIGN KEY ("legal_id") REFERENCES "public"."legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_social_media_links" ADD CONSTRAINT "contact_social_media_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_feature_sizes_feature_filename_idx" ON "media" USING btree ("sizes_feature_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "pages_blocks_hero_gradient_config_colors_order_idx" ON "pages_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_gradient_config_colors_parent_id_idx" ON "pages_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_actions_order_idx" ON "pages_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_actions_parent_id_idx" ON "pages_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_media_idx" ON "pages_blocks_hero" USING btree ("media_id");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_media_idx" ON "pages_blocks_cta" USING btree ("media_id");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_banner_order_idx" ON "pages_blocks_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_banner_parent_id_idx" ON "pages_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_banner_path_idx" ON "pages_blocks_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_code_order_idx" ON "pages_blocks_code" USING btree ("_order");
  CREATE INDEX "pages_blocks_code_parent_id_idx" ON "pages_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_code_path_idx" ON "pages_blocks_code" USING btree ("_path");
  CREATE INDEX "pages_blocks_services_grid_services_features_order_idx" ON "pages_blocks_services_grid_services_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_services_features_parent_id_idx" ON "pages_blocks_services_grid_services_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_services_order_idx" ON "pages_blocks_services_grid_services" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_services_parent_id_idx" ON "pages_blocks_services_grid_services" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_order_idx" ON "pages_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_services_grid_parent_id_idx" ON "pages_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_services_grid_path_idx" ON "pages_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_tech_stack_technologies_order_idx" ON "pages_blocks_tech_stack_technologies" USING btree ("_order");
  CREATE INDEX "pages_blocks_tech_stack_technologies_parent_id_idx" ON "pages_blocks_tech_stack_technologies" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tech_stack_technologies_icon_idx" ON "pages_blocks_tech_stack_technologies" USING btree ("icon_id");
  CREATE INDEX "pages_blocks_tech_stack_order_idx" ON "pages_blocks_tech_stack" USING btree ("_order");
  CREATE INDEX "pages_blocks_tech_stack_parent_id_idx" ON "pages_blocks_tech_stack" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_tech_stack_path_idx" ON "pages_blocks_tech_stack" USING btree ("_path");
  CREATE INDEX "pages_blocks_process_steps_steps_order_idx" ON "pages_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_steps_parent_id_idx" ON "pages_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_order_idx" ON "pages_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_process_steps_parent_id_idx" ON "pages_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_process_steps_path_idx" ON "pages_blocks_process_steps" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_table_tiers_features_order_idx" ON "pages_blocks_pricing_table_tiers_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_table_tiers_features_parent_id_idx" ON "pages_blocks_pricing_table_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_table_tiers_order_idx" ON "pages_blocks_pricing_table_tiers" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_table_tiers_parent_id_idx" ON "pages_blocks_pricing_table_tiers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_table_order_idx" ON "pages_blocks_pricing_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_table_parent_id_idx" ON "pages_blocks_pricing_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_table_path_idx" ON "pages_blocks_pricing_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_project_showcase_projects_technologies_order_idx" ON "pages_blocks_project_showcase_projects_technologies" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_showcase_projects_technologies_parent_id_idx" ON "pages_blocks_project_showcase_projects_technologies" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_showcase_projects_order_idx" ON "pages_blocks_project_showcase_projects" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_showcase_projects_parent_id_idx" ON "pages_blocks_project_showcase_projects" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_showcase_projects_image_idx" ON "pages_blocks_project_showcase_projects" USING btree ("image_id");
  CREATE INDEX "pages_blocks_project_showcase_filter_categories_order_idx" ON "pages_blocks_project_showcase_filter_categories" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_showcase_filter_categories_parent_id_idx" ON "pages_blocks_project_showcase_filter_categories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_showcase_order_idx" ON "pages_blocks_project_showcase" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_showcase_parent_id_idx" ON "pages_blocks_project_showcase" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_showcase_path_idx" ON "pages_blocks_project_showcase" USING btree ("_path");
  CREATE INDEX "pages_blocks_case_study_approach_steps_order_idx" ON "pages_blocks_case_study_approach_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_approach_steps_parent_id_idx" ON "pages_blocks_case_study_approach_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_solution_technologies_order_idx" ON "pages_blocks_case_study_solution_technologies" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_solution_technologies_parent_id_idx" ON "pages_blocks_case_study_solution_technologies" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_results_metrics_order_idx" ON "pages_blocks_case_study_results_metrics" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_results_metrics_parent_id_idx" ON "pages_blocks_case_study_results_metrics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_order_idx" ON "pages_blocks_case_study" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_parent_id_idx" ON "pages_blocks_case_study" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_path_idx" ON "pages_blocks_case_study" USING btree ("_path");
  CREATE INDEX "pages_blocks_case_study_challenge_challenge_image_idx" ON "pages_blocks_case_study" USING btree ("challenge_image_id");
  CREATE INDEX "pages_blocks_case_study_solution_solution_image_idx" ON "pages_blocks_case_study" USING btree ("solution_image_id");
  CREATE INDEX "pages_blocks_before_after_order_idx" ON "pages_blocks_before_after" USING btree ("_order");
  CREATE INDEX "pages_blocks_before_after_parent_id_idx" ON "pages_blocks_before_after" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_before_after_path_idx" ON "pages_blocks_before_after" USING btree ("_path");
  CREATE INDEX "pages_blocks_before_after_before_image_idx" ON "pages_blocks_before_after" USING btree ("before_image_id");
  CREATE INDEX "pages_blocks_before_after_after_image_idx" ON "pages_blocks_before_after" USING btree ("after_image_id");
  CREATE INDEX "pages_blocks_testimonial_testimonials_order_idx" ON "pages_blocks_testimonial_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_testimonials_parent_id_idx" ON "pages_blocks_testimonial_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_testimonials_avatar_idx" ON "pages_blocks_testimonial_testimonials" USING btree ("avatar_id");
  CREATE INDEX "pages_blocks_testimonial_order_idx" ON "pages_blocks_testimonial" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_parent_id_idx" ON "pages_blocks_testimonial" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_path_idx" ON "pages_blocks_testimonial" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_grid_features_order_idx" ON "pages_blocks_feature_grid_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_features_parent_id_idx" ON "pages_blocks_feature_grid_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_order_idx" ON "pages_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_grid_parent_id_idx" ON "pages_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_grid_path_idx" ON "pages_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_counter_stats_order_idx" ON "pages_blocks_stats_counter_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_counter_stats_parent_id_idx" ON "pages_blocks_stats_counter_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_counter_order_idx" ON "pages_blocks_stats_counter" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_counter_parent_id_idx" ON "pages_blocks_stats_counter" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_counter_path_idx" ON "pages_blocks_stats_counter" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_accordion_faqs_order_idx" ON "pages_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_accordion_faqs_parent_id_idx" ON "pages_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_accordion_order_idx" ON "pages_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_accordion_parent_id_idx" ON "pages_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_accordion_path_idx" ON "pages_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_items_order_idx" ON "pages_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_items_parent_id_idx" ON "pages_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_items_image_idx" ON "pages_blocks_timeline_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_form_form_idx" ON "pages_blocks_contact_form" USING btree ("form_id");
  CREATE INDEX "pages_blocks_newsletter_order_idx" ON "pages_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_parent_id_idx" ON "pages_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_path_idx" ON "pages_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "pages_blocks_social_proof_logos_order_idx" ON "pages_blocks_social_proof_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_proof_logos_parent_id_idx" ON "pages_blocks_social_proof_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_proof_logos_image_idx" ON "pages_blocks_social_proof_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_social_proof_stats_order_idx" ON "pages_blocks_social_proof_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_proof_stats_parent_id_idx" ON "pages_blocks_social_proof_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_proof_badges_order_idx" ON "pages_blocks_social_proof_badges" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_proof_badges_parent_id_idx" ON "pages_blocks_social_proof_badges" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_proof_badges_image_idx" ON "pages_blocks_social_proof_badges" USING btree ("image_id");
  CREATE INDEX "pages_blocks_social_proof_order_idx" ON "pages_blocks_social_proof" USING btree ("_order");
  CREATE INDEX "pages_blocks_social_proof_parent_id_idx" ON "pages_blocks_social_proof" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_social_proof_path_idx" ON "pages_blocks_social_proof" USING btree ("_path");
  CREATE INDEX "pages_blocks_container_order_idx" ON "pages_blocks_container" USING btree ("_order");
  CREATE INDEX "pages_blocks_container_parent_id_idx" ON "pages_blocks_container" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_container_path_idx" ON "pages_blocks_container" USING btree ("_path");
  CREATE INDEX "pages_blocks_container_background_image_idx" ON "pages_blocks_container" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_divider_order_idx" ON "pages_blocks_divider" USING btree ("_order");
  CREATE INDEX "pages_blocks_divider_parent_id_idx" ON "pages_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_divider_path_idx" ON "pages_blocks_divider" USING btree ("_path");
  CREATE INDEX "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX "pages_breadcrumbs_order_idx" ON "pages_breadcrumbs" USING btree ("_order");
  CREATE INDEX "pages_breadcrumbs_parent_id_idx" ON "pages_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "pages_breadcrumbs_doc_idx" ON "pages_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_meta_structured_meta_structured_author_idx" ON "pages" USING btree ("meta_structured_author_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_blogs_id_idx" ON "pages_rels" USING btree ("blogs_id");
  CREATE INDEX "pages_rels_services_id_idx" ON "pages_rels" USING btree ("services_id");
  CREATE INDEX "pages_rels_legal_id_idx" ON "pages_rels" USING btree ("legal_id");
  CREATE INDEX "pages_rels_contacts_id_idx" ON "pages_rels" USING btree ("contacts_id");
  CREATE INDEX "_pages_v_blocks_hero_gradient_config_colors_order_idx" ON "_pages_v_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_gradient_config_colors_parent_id_idx" ON "_pages_v_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_actions_order_idx" ON "_pages_v_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_actions_parent_id_idx" ON "_pages_v_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_media_idx" ON "_pages_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_media_idx" ON "_pages_v_blocks_cta" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_banner_order_idx" ON "_pages_v_blocks_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_banner_parent_id_idx" ON "_pages_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_banner_path_idx" ON "_pages_v_blocks_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_code_order_idx" ON "_pages_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_code_parent_id_idx" ON "_pages_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_code_path_idx" ON "_pages_v_blocks_code" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_services_grid_services_features_order_idx" ON "_pages_v_blocks_services_grid_services_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_grid_services_features_parent_id_idx" ON "_pages_v_blocks_services_grid_services_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_services_order_idx" ON "_pages_v_blocks_services_grid_services" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_grid_services_parent_id_idx" ON "_pages_v_blocks_services_grid_services" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_order_idx" ON "_pages_v_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_services_grid_parent_id_idx" ON "_pages_v_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_services_grid_path_idx" ON "_pages_v_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_tech_stack_technologies_order_idx" ON "_pages_v_blocks_tech_stack_technologies" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tech_stack_technologies_parent_id_idx" ON "_pages_v_blocks_tech_stack_technologies" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tech_stack_technologies_icon_idx" ON "_pages_v_blocks_tech_stack_technologies" USING btree ("icon_id");
  CREATE INDEX "_pages_v_blocks_tech_stack_order_idx" ON "_pages_v_blocks_tech_stack" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_tech_stack_parent_id_idx" ON "_pages_v_blocks_tech_stack" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_tech_stack_path_idx" ON "_pages_v_blocks_tech_stack" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_order_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_steps_parent_id_idx" ON "_pages_v_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_order_idx" ON "_pages_v_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_process_steps_parent_id_idx" ON "_pages_v_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_process_steps_path_idx" ON "_pages_v_blocks_process_steps" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pricing_table_tiers_features_order_idx" ON "_pages_v_blocks_pricing_table_tiers_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_table_tiers_features_parent_id_idx" ON "_pages_v_blocks_pricing_table_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_table_tiers_order_idx" ON "_pages_v_blocks_pricing_table_tiers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_table_tiers_parent_id_idx" ON "_pages_v_blocks_pricing_table_tiers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_table_order_idx" ON "_pages_v_blocks_pricing_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_table_parent_id_idx" ON "_pages_v_blocks_pricing_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_table_path_idx" ON "_pages_v_blocks_pricing_table" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_project_showcase_projects_technologies_order_idx" ON "_pages_v_blocks_project_showcase_projects_technologies" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_showcase_projects_technologies_parent_id_idx" ON "_pages_v_blocks_project_showcase_projects_technologies" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_projects_order_idx" ON "_pages_v_blocks_project_showcase_projects" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_showcase_projects_parent_id_idx" ON "_pages_v_blocks_project_showcase_projects" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_projects_image_idx" ON "_pages_v_blocks_project_showcase_projects" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_filter_categories_order_idx" ON "_pages_v_blocks_project_showcase_filter_categories" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_showcase_filter_categories_parent_id_idx" ON "_pages_v_blocks_project_showcase_filter_categories" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_order_idx" ON "_pages_v_blocks_project_showcase" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_showcase_parent_id_idx" ON "_pages_v_blocks_project_showcase" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_showcase_path_idx" ON "_pages_v_blocks_project_showcase" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_case_study_approach_steps_order_idx" ON "_pages_v_blocks_case_study_approach_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_study_approach_steps_parent_id_idx" ON "_pages_v_blocks_case_study_approach_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_study_solution_technologies_order_idx" ON "_pages_v_blocks_case_study_solution_technologies" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_study_solution_technologies_parent_id_idx" ON "_pages_v_blocks_case_study_solution_technologies" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_study_results_metrics_order_idx" ON "_pages_v_blocks_case_study_results_metrics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_study_results_metrics_parent_id_idx" ON "_pages_v_blocks_case_study_results_metrics" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_study_order_idx" ON "_pages_v_blocks_case_study" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_study_parent_id_idx" ON "_pages_v_blocks_case_study" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_study_path_idx" ON "_pages_v_blocks_case_study" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_case_study_challenge_challenge_image_idx" ON "_pages_v_blocks_case_study" USING btree ("challenge_image_id");
  CREATE INDEX "_pages_v_blocks_case_study_solution_solution_image_idx" ON "_pages_v_blocks_case_study" USING btree ("solution_image_id");
  CREATE INDEX "_pages_v_blocks_before_after_order_idx" ON "_pages_v_blocks_before_after" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_before_after_parent_id_idx" ON "_pages_v_blocks_before_after" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_before_after_path_idx" ON "_pages_v_blocks_before_after" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_before_after_before_image_idx" ON "_pages_v_blocks_before_after" USING btree ("before_image_id");
  CREATE INDEX "_pages_v_blocks_before_after_after_image_idx" ON "_pages_v_blocks_before_after" USING btree ("after_image_id");
  CREATE INDEX "_pages_v_blocks_testimonial_testimonials_order_idx" ON "_pages_v_blocks_testimonial_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonial_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_testimonials_avatar_idx" ON "_pages_v_blocks_testimonial_testimonials" USING btree ("avatar_id");
  CREATE INDEX "_pages_v_blocks_testimonial_order_idx" ON "_pages_v_blocks_testimonial" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_parent_id_idx" ON "_pages_v_blocks_testimonial" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_path_idx" ON "_pages_v_blocks_testimonial" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_grid_features_order_idx" ON "_pages_v_blocks_feature_grid_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_features_parent_id_idx" ON "_pages_v_blocks_feature_grid_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_order_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_grid_parent_id_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_grid_path_idx" ON "_pages_v_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_counter_stats_order_idx" ON "_pages_v_blocks_stats_counter_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_counter_stats_parent_id_idx" ON "_pages_v_blocks_stats_counter_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_counter_order_idx" ON "_pages_v_blocks_stats_counter" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_counter_parent_id_idx" ON "_pages_v_blocks_stats_counter" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_counter_path_idx" ON "_pages_v_blocks_stats_counter" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_faq_accordion_faqs_order_idx" ON "_pages_v_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_accordion_faqs_parent_id_idx" ON "_pages_v_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_accordion_order_idx" ON "_pages_v_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_accordion_parent_id_idx" ON "_pages_v_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_accordion_path_idx" ON "_pages_v_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_items_order_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_items_parent_id_idx" ON "_pages_v_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_items_image_idx" ON "_pages_v_blocks_timeline_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_order_idx" ON "_pages_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_form_parent_id_idx" ON "_pages_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_form_path_idx" ON "_pages_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_form_form_idx" ON "_pages_v_blocks_contact_form" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_newsletter_order_idx" ON "_pages_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_parent_id_idx" ON "_pages_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_path_idx" ON "_pages_v_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_social_proof_logos_order_idx" ON "_pages_v_blocks_social_proof_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_social_proof_logos_parent_id_idx" ON "_pages_v_blocks_social_proof_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_social_proof_logos_image_idx" ON "_pages_v_blocks_social_proof_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_social_proof_stats_order_idx" ON "_pages_v_blocks_social_proof_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_social_proof_stats_parent_id_idx" ON "_pages_v_blocks_social_proof_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_social_proof_badges_order_idx" ON "_pages_v_blocks_social_proof_badges" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_social_proof_badges_parent_id_idx" ON "_pages_v_blocks_social_proof_badges" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_social_proof_badges_image_idx" ON "_pages_v_blocks_social_proof_badges" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_social_proof_order_idx" ON "_pages_v_blocks_social_proof" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_social_proof_parent_id_idx" ON "_pages_v_blocks_social_proof" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_social_proof_path_idx" ON "_pages_v_blocks_social_proof" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_container_order_idx" ON "_pages_v_blocks_container" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_container_parent_id_idx" ON "_pages_v_blocks_container" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_container_path_idx" ON "_pages_v_blocks_container" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_container_background_image_idx" ON "_pages_v_blocks_container" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_divider_order_idx" ON "_pages_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_divider_parent_id_idx" ON "_pages_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_divider_path_idx" ON "_pages_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_version_breadcrumbs_order_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_pages_v_version_breadcrumbs_parent_id_idx" ON "_pages_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_breadcrumbs_doc_idx" ON "_pages_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_meta_structured_version_meta_structured_idx" ON "_pages_v" USING btree ("version_meta_structured_author_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_blogs_id_idx" ON "_pages_v_rels" USING btree ("blogs_id");
  CREATE INDEX "_pages_v_rels_services_id_idx" ON "_pages_v_rels" USING btree ("services_id");
  CREATE INDEX "_pages_v_rels_legal_id_idx" ON "_pages_v_rels" USING btree ("legal_id");
  CREATE INDEX "_pages_v_rels_contacts_id_idx" ON "_pages_v_rels" USING btree ("contacts_id");
  CREATE INDEX "blogs_blocks_hero_gradient_config_colors_order_idx" ON "blogs_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "blogs_blocks_hero_gradient_config_colors_parent_id_idx" ON "blogs_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_hero_actions_order_idx" ON "blogs_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "blogs_blocks_hero_actions_parent_id_idx" ON "blogs_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_hero_order_idx" ON "blogs_blocks_hero" USING btree ("_order");
  CREATE INDEX "blogs_blocks_hero_parent_id_idx" ON "blogs_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_hero_path_idx" ON "blogs_blocks_hero" USING btree ("_path");
  CREATE INDEX "blogs_blocks_hero_media_idx" ON "blogs_blocks_hero" USING btree ("media_id");
  CREATE INDEX "blogs_blocks_content_columns_order_idx" ON "blogs_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "blogs_blocks_content_columns_parent_id_idx" ON "blogs_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_content_order_idx" ON "blogs_blocks_content" USING btree ("_order");
  CREATE INDEX "blogs_blocks_content_parent_id_idx" ON "blogs_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_content_path_idx" ON "blogs_blocks_content" USING btree ("_path");
  CREATE INDEX "blogs_blocks_media_block_order_idx" ON "blogs_blocks_media_block" USING btree ("_order");
  CREATE INDEX "blogs_blocks_media_block_parent_id_idx" ON "blogs_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_media_block_path_idx" ON "blogs_blocks_media_block" USING btree ("_path");
  CREATE INDEX "blogs_blocks_media_block_media_idx" ON "blogs_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "blogs_blocks_archive_order_idx" ON "blogs_blocks_archive" USING btree ("_order");
  CREATE INDEX "blogs_blocks_archive_parent_id_idx" ON "blogs_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_archive_path_idx" ON "blogs_blocks_archive" USING btree ("_path");
  CREATE INDEX "blogs_blocks_banner_order_idx" ON "blogs_blocks_banner" USING btree ("_order");
  CREATE INDEX "blogs_blocks_banner_parent_id_idx" ON "blogs_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_banner_path_idx" ON "blogs_blocks_banner" USING btree ("_path");
  CREATE INDEX "blogs_blocks_code_order_idx" ON "blogs_blocks_code" USING btree ("_order");
  CREATE INDEX "blogs_blocks_code_parent_id_idx" ON "blogs_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_code_path_idx" ON "blogs_blocks_code" USING btree ("_path");
  CREATE INDEX "blogs_blocks_feature_grid_features_order_idx" ON "blogs_blocks_feature_grid_features" USING btree ("_order");
  CREATE INDEX "blogs_blocks_feature_grid_features_parent_id_idx" ON "blogs_blocks_feature_grid_features" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_feature_grid_order_idx" ON "blogs_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "blogs_blocks_feature_grid_parent_id_idx" ON "blogs_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_feature_grid_path_idx" ON "blogs_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "blogs_blocks_stats_counter_stats_order_idx" ON "blogs_blocks_stats_counter_stats" USING btree ("_order");
  CREATE INDEX "blogs_blocks_stats_counter_stats_parent_id_idx" ON "blogs_blocks_stats_counter_stats" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_stats_counter_order_idx" ON "blogs_blocks_stats_counter" USING btree ("_order");
  CREATE INDEX "blogs_blocks_stats_counter_parent_id_idx" ON "blogs_blocks_stats_counter" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_stats_counter_path_idx" ON "blogs_blocks_stats_counter" USING btree ("_path");
  CREATE INDEX "blogs_blocks_faq_accordion_faqs_order_idx" ON "blogs_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "blogs_blocks_faq_accordion_faqs_parent_id_idx" ON "blogs_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_faq_accordion_order_idx" ON "blogs_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "blogs_blocks_faq_accordion_parent_id_idx" ON "blogs_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_faq_accordion_path_idx" ON "blogs_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "blogs_blocks_timeline_items_order_idx" ON "blogs_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "blogs_blocks_timeline_items_parent_id_idx" ON "blogs_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_timeline_items_image_idx" ON "blogs_blocks_timeline_items" USING btree ("image_id");
  CREATE INDEX "blogs_blocks_timeline_order_idx" ON "blogs_blocks_timeline" USING btree ("_order");
  CREATE INDEX "blogs_blocks_timeline_parent_id_idx" ON "blogs_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_timeline_path_idx" ON "blogs_blocks_timeline" USING btree ("_path");
  CREATE INDEX "blogs_blocks_cta_links_order_idx" ON "blogs_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "blogs_blocks_cta_links_parent_id_idx" ON "blogs_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_cta_order_idx" ON "blogs_blocks_cta" USING btree ("_order");
  CREATE INDEX "blogs_blocks_cta_parent_id_idx" ON "blogs_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_cta_path_idx" ON "blogs_blocks_cta" USING btree ("_path");
  CREATE INDEX "blogs_blocks_cta_media_idx" ON "blogs_blocks_cta" USING btree ("media_id");
  CREATE INDEX "blogs_blocks_newsletter_order_idx" ON "blogs_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "blogs_blocks_newsletter_parent_id_idx" ON "blogs_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_newsletter_path_idx" ON "blogs_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "blogs_blocks_social_proof_logos_order_idx" ON "blogs_blocks_social_proof_logos" USING btree ("_order");
  CREATE INDEX "blogs_blocks_social_proof_logos_parent_id_idx" ON "blogs_blocks_social_proof_logos" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_social_proof_logos_image_idx" ON "blogs_blocks_social_proof_logos" USING btree ("image_id");
  CREATE INDEX "blogs_blocks_social_proof_stats_order_idx" ON "blogs_blocks_social_proof_stats" USING btree ("_order");
  CREATE INDEX "blogs_blocks_social_proof_stats_parent_id_idx" ON "blogs_blocks_social_proof_stats" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_social_proof_badges_order_idx" ON "blogs_blocks_social_proof_badges" USING btree ("_order");
  CREATE INDEX "blogs_blocks_social_proof_badges_parent_id_idx" ON "blogs_blocks_social_proof_badges" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_social_proof_badges_image_idx" ON "blogs_blocks_social_proof_badges" USING btree ("image_id");
  CREATE INDEX "blogs_blocks_social_proof_order_idx" ON "blogs_blocks_social_proof" USING btree ("_order");
  CREATE INDEX "blogs_blocks_social_proof_parent_id_idx" ON "blogs_blocks_social_proof" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_social_proof_path_idx" ON "blogs_blocks_social_proof" USING btree ("_path");
  CREATE INDEX "blogs_blocks_container_order_idx" ON "blogs_blocks_container" USING btree ("_order");
  CREATE INDEX "blogs_blocks_container_parent_id_idx" ON "blogs_blocks_container" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_container_path_idx" ON "blogs_blocks_container" USING btree ("_path");
  CREATE INDEX "blogs_blocks_container_background_image_idx" ON "blogs_blocks_container" USING btree ("background_image_id");
  CREATE INDEX "blogs_blocks_divider_order_idx" ON "blogs_blocks_divider" USING btree ("_order");
  CREATE INDEX "blogs_blocks_divider_parent_id_idx" ON "blogs_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_divider_path_idx" ON "blogs_blocks_divider" USING btree ("_path");
  CREATE INDEX "blogs_blocks_spacer_order_idx" ON "blogs_blocks_spacer" USING btree ("_order");
  CREATE INDEX "blogs_blocks_spacer_parent_id_idx" ON "blogs_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "blogs_blocks_spacer_path_idx" ON "blogs_blocks_spacer" USING btree ("_path");
  CREATE INDEX "blogs_tags_order_idx" ON "blogs_tags" USING btree ("_order");
  CREATE INDEX "blogs_tags_parent_id_idx" ON "blogs_tags" USING btree ("_parent_id");
  CREATE INDEX "blogs_meta_meta_image_idx" ON "blogs" USING btree ("meta_image_id");
  CREATE INDEX "blogs_meta_structured_meta_structured_author_idx" ON "blogs" USING btree ("meta_structured_author_id");
  CREATE UNIQUE INDEX "blogs_slug_idx" ON "blogs" USING btree ("slug");
  CREATE INDEX "blogs_author_idx" ON "blogs" USING btree ("author_id");
  CREATE INDEX "blogs_created_by_idx" ON "blogs" USING btree ("created_by_id");
  CREATE INDEX "blogs_updated_by_idx" ON "blogs" USING btree ("updated_by_id");
  CREATE INDEX "blogs_updated_at_idx" ON "blogs" USING btree ("updated_at");
  CREATE INDEX "blogs_created_at_idx" ON "blogs" USING btree ("created_at");
  CREATE INDEX "blogs__status_idx" ON "blogs" USING btree ("_status");
  CREATE INDEX "blogs_rels_order_idx" ON "blogs_rels" USING btree ("order");
  CREATE INDEX "blogs_rels_parent_idx" ON "blogs_rels" USING btree ("parent_id");
  CREATE INDEX "blogs_rels_path_idx" ON "blogs_rels" USING btree ("path");
  CREATE INDEX "blogs_rels_pages_id_idx" ON "blogs_rels" USING btree ("pages_id");
  CREATE INDEX "blogs_rels_blogs_id_idx" ON "blogs_rels" USING btree ("blogs_id");
  CREATE INDEX "blogs_rels_services_id_idx" ON "blogs_rels" USING btree ("services_id");
  CREATE INDEX "blogs_rels_legal_id_idx" ON "blogs_rels" USING btree ("legal_id");
  CREATE INDEX "blogs_rels_contacts_id_idx" ON "blogs_rels" USING btree ("contacts_id");
  CREATE INDEX "_blogs_v_blocks_hero_gradient_config_colors_order_idx" ON "_blogs_v_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_hero_gradient_config_colors_parent_id_idx" ON "_blogs_v_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_hero_actions_order_idx" ON "_blogs_v_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_hero_actions_parent_id_idx" ON "_blogs_v_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_hero_order_idx" ON "_blogs_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_hero_parent_id_idx" ON "_blogs_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_hero_path_idx" ON "_blogs_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_hero_media_idx" ON "_blogs_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_blogs_v_blocks_content_columns_order_idx" ON "_blogs_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_content_columns_parent_id_idx" ON "_blogs_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_content_order_idx" ON "_blogs_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_content_parent_id_idx" ON "_blogs_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_content_path_idx" ON "_blogs_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_media_block_order_idx" ON "_blogs_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_media_block_parent_id_idx" ON "_blogs_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_media_block_path_idx" ON "_blogs_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_media_block_media_idx" ON "_blogs_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_blogs_v_blocks_archive_order_idx" ON "_blogs_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_archive_parent_id_idx" ON "_blogs_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_archive_path_idx" ON "_blogs_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_banner_order_idx" ON "_blogs_v_blocks_banner" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_banner_parent_id_idx" ON "_blogs_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_banner_path_idx" ON "_blogs_v_blocks_banner" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_code_order_idx" ON "_blogs_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_code_parent_id_idx" ON "_blogs_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_code_path_idx" ON "_blogs_v_blocks_code" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_feature_grid_features_order_idx" ON "_blogs_v_blocks_feature_grid_features" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_feature_grid_features_parent_id_idx" ON "_blogs_v_blocks_feature_grid_features" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_feature_grid_order_idx" ON "_blogs_v_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_feature_grid_parent_id_idx" ON "_blogs_v_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_feature_grid_path_idx" ON "_blogs_v_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_stats_counter_stats_order_idx" ON "_blogs_v_blocks_stats_counter_stats" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_stats_counter_stats_parent_id_idx" ON "_blogs_v_blocks_stats_counter_stats" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_stats_counter_order_idx" ON "_blogs_v_blocks_stats_counter" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_stats_counter_parent_id_idx" ON "_blogs_v_blocks_stats_counter" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_stats_counter_path_idx" ON "_blogs_v_blocks_stats_counter" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_faq_accordion_faqs_order_idx" ON "_blogs_v_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_faq_accordion_faqs_parent_id_idx" ON "_blogs_v_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_faq_accordion_order_idx" ON "_blogs_v_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_faq_accordion_parent_id_idx" ON "_blogs_v_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_faq_accordion_path_idx" ON "_blogs_v_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_timeline_items_order_idx" ON "_blogs_v_blocks_timeline_items" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_timeline_items_parent_id_idx" ON "_blogs_v_blocks_timeline_items" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_timeline_items_image_idx" ON "_blogs_v_blocks_timeline_items" USING btree ("image_id");
  CREATE INDEX "_blogs_v_blocks_timeline_order_idx" ON "_blogs_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_timeline_parent_id_idx" ON "_blogs_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_timeline_path_idx" ON "_blogs_v_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_cta_links_order_idx" ON "_blogs_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_cta_links_parent_id_idx" ON "_blogs_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_cta_order_idx" ON "_blogs_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_cta_parent_id_idx" ON "_blogs_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_cta_path_idx" ON "_blogs_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_cta_media_idx" ON "_blogs_v_blocks_cta" USING btree ("media_id");
  CREATE INDEX "_blogs_v_blocks_newsletter_order_idx" ON "_blogs_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_newsletter_parent_id_idx" ON "_blogs_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_newsletter_path_idx" ON "_blogs_v_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_social_proof_logos_order_idx" ON "_blogs_v_blocks_social_proof_logos" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_social_proof_logos_parent_id_idx" ON "_blogs_v_blocks_social_proof_logos" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_social_proof_logos_image_idx" ON "_blogs_v_blocks_social_proof_logos" USING btree ("image_id");
  CREATE INDEX "_blogs_v_blocks_social_proof_stats_order_idx" ON "_blogs_v_blocks_social_proof_stats" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_social_proof_stats_parent_id_idx" ON "_blogs_v_blocks_social_proof_stats" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_social_proof_badges_order_idx" ON "_blogs_v_blocks_social_proof_badges" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_social_proof_badges_parent_id_idx" ON "_blogs_v_blocks_social_proof_badges" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_social_proof_badges_image_idx" ON "_blogs_v_blocks_social_proof_badges" USING btree ("image_id");
  CREATE INDEX "_blogs_v_blocks_social_proof_order_idx" ON "_blogs_v_blocks_social_proof" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_social_proof_parent_id_idx" ON "_blogs_v_blocks_social_proof" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_social_proof_path_idx" ON "_blogs_v_blocks_social_proof" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_container_order_idx" ON "_blogs_v_blocks_container" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_container_parent_id_idx" ON "_blogs_v_blocks_container" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_container_path_idx" ON "_blogs_v_blocks_container" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_container_background_image_idx" ON "_blogs_v_blocks_container" USING btree ("background_image_id");
  CREATE INDEX "_blogs_v_blocks_divider_order_idx" ON "_blogs_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_divider_parent_id_idx" ON "_blogs_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_divider_path_idx" ON "_blogs_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_blogs_v_blocks_spacer_order_idx" ON "_blogs_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_blogs_v_blocks_spacer_parent_id_idx" ON "_blogs_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_blocks_spacer_path_idx" ON "_blogs_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_blogs_v_version_tags_order_idx" ON "_blogs_v_version_tags" USING btree ("_order");
  CREATE INDEX "_blogs_v_version_tags_parent_id_idx" ON "_blogs_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_blogs_v_parent_idx" ON "_blogs_v" USING btree ("parent_id");
  CREATE INDEX "_blogs_v_version_meta_version_meta_image_idx" ON "_blogs_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_blogs_v_version_meta_structured_version_meta_structured_idx" ON "_blogs_v" USING btree ("version_meta_structured_author_id");
  CREATE INDEX "_blogs_v_version_version_slug_idx" ON "_blogs_v" USING btree ("version_slug");
  CREATE INDEX "_blogs_v_version_version_author_idx" ON "_blogs_v" USING btree ("version_author_id");
  CREATE INDEX "_blogs_v_version_version_created_by_idx" ON "_blogs_v" USING btree ("version_created_by_id");
  CREATE INDEX "_blogs_v_version_version_updated_by_idx" ON "_blogs_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_blogs_v_version_version_updated_at_idx" ON "_blogs_v" USING btree ("version_updated_at");
  CREATE INDEX "_blogs_v_version_version_created_at_idx" ON "_blogs_v" USING btree ("version_created_at");
  CREATE INDEX "_blogs_v_version_version__status_idx" ON "_blogs_v" USING btree ("version__status");
  CREATE INDEX "_blogs_v_created_at_idx" ON "_blogs_v" USING btree ("created_at");
  CREATE INDEX "_blogs_v_updated_at_idx" ON "_blogs_v" USING btree ("updated_at");
  CREATE INDEX "_blogs_v_latest_idx" ON "_blogs_v" USING btree ("latest");
  CREATE INDEX "_blogs_v_autosave_idx" ON "_blogs_v" USING btree ("autosave");
  CREATE INDEX "_blogs_v_rels_order_idx" ON "_blogs_v_rels" USING btree ("order");
  CREATE INDEX "_blogs_v_rels_parent_idx" ON "_blogs_v_rels" USING btree ("parent_id");
  CREATE INDEX "_blogs_v_rels_path_idx" ON "_blogs_v_rels" USING btree ("path");
  CREATE INDEX "_blogs_v_rels_pages_id_idx" ON "_blogs_v_rels" USING btree ("pages_id");
  CREATE INDEX "_blogs_v_rels_blogs_id_idx" ON "_blogs_v_rels" USING btree ("blogs_id");
  CREATE INDEX "_blogs_v_rels_services_id_idx" ON "_blogs_v_rels" USING btree ("services_id");
  CREATE INDEX "_blogs_v_rels_legal_id_idx" ON "_blogs_v_rels" USING btree ("legal_id");
  CREATE INDEX "_blogs_v_rels_contacts_id_idx" ON "_blogs_v_rels" USING btree ("contacts_id");
  CREATE INDEX "services_blocks_hero_gradient_config_colors_order_idx" ON "services_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "services_blocks_hero_gradient_config_colors_parent_id_idx" ON "services_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_hero_actions_order_idx" ON "services_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "services_blocks_hero_actions_parent_id_idx" ON "services_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_hero_order_idx" ON "services_blocks_hero" USING btree ("_order");
  CREATE INDEX "services_blocks_hero_parent_id_idx" ON "services_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_hero_path_idx" ON "services_blocks_hero" USING btree ("_path");
  CREATE INDEX "services_blocks_hero_media_idx" ON "services_blocks_hero" USING btree ("media_id");
  CREATE INDEX "services_blocks_content_columns_order_idx" ON "services_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "services_blocks_content_columns_parent_id_idx" ON "services_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_content_order_idx" ON "services_blocks_content" USING btree ("_order");
  CREATE INDEX "services_blocks_content_parent_id_idx" ON "services_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_content_path_idx" ON "services_blocks_content" USING btree ("_path");
  CREATE INDEX "services_blocks_media_block_order_idx" ON "services_blocks_media_block" USING btree ("_order");
  CREATE INDEX "services_blocks_media_block_parent_id_idx" ON "services_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_media_block_path_idx" ON "services_blocks_media_block" USING btree ("_path");
  CREATE INDEX "services_blocks_media_block_media_idx" ON "services_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "services_blocks_cta_links_order_idx" ON "services_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "services_blocks_cta_links_parent_id_idx" ON "services_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_cta_order_idx" ON "services_blocks_cta" USING btree ("_order");
  CREATE INDEX "services_blocks_cta_parent_id_idx" ON "services_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_cta_path_idx" ON "services_blocks_cta" USING btree ("_path");
  CREATE INDEX "services_blocks_cta_media_idx" ON "services_blocks_cta" USING btree ("media_id");
  CREATE INDEX "services_blocks_services_grid_services_features_order_idx" ON "services_blocks_services_grid_services_features" USING btree ("_order");
  CREATE INDEX "services_blocks_services_grid_services_features_parent_id_idx" ON "services_blocks_services_grid_services_features" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_services_grid_services_order_idx" ON "services_blocks_services_grid_services" USING btree ("_order");
  CREATE INDEX "services_blocks_services_grid_services_parent_id_idx" ON "services_blocks_services_grid_services" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_services_grid_order_idx" ON "services_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "services_blocks_services_grid_parent_id_idx" ON "services_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_services_grid_path_idx" ON "services_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "services_blocks_tech_stack_technologies_order_idx" ON "services_blocks_tech_stack_technologies" USING btree ("_order");
  CREATE INDEX "services_blocks_tech_stack_technologies_parent_id_idx" ON "services_blocks_tech_stack_technologies" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_tech_stack_technologies_icon_idx" ON "services_blocks_tech_stack_technologies" USING btree ("icon_id");
  CREATE INDEX "services_blocks_tech_stack_order_idx" ON "services_blocks_tech_stack" USING btree ("_order");
  CREATE INDEX "services_blocks_tech_stack_parent_id_idx" ON "services_blocks_tech_stack" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_tech_stack_path_idx" ON "services_blocks_tech_stack" USING btree ("_path");
  CREATE INDEX "services_blocks_process_steps_steps_order_idx" ON "services_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "services_blocks_process_steps_steps_parent_id_idx" ON "services_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_process_steps_order_idx" ON "services_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "services_blocks_process_steps_parent_id_idx" ON "services_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_process_steps_path_idx" ON "services_blocks_process_steps" USING btree ("_path");
  CREATE INDEX "services_blocks_pricing_table_tiers_features_order_idx" ON "services_blocks_pricing_table_tiers_features" USING btree ("_order");
  CREATE INDEX "services_blocks_pricing_table_tiers_features_parent_id_idx" ON "services_blocks_pricing_table_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_pricing_table_tiers_order_idx" ON "services_blocks_pricing_table_tiers" USING btree ("_order");
  CREATE INDEX "services_blocks_pricing_table_tiers_parent_id_idx" ON "services_blocks_pricing_table_tiers" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_pricing_table_order_idx" ON "services_blocks_pricing_table" USING btree ("_order");
  CREATE INDEX "services_blocks_pricing_table_parent_id_idx" ON "services_blocks_pricing_table" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_pricing_table_path_idx" ON "services_blocks_pricing_table" USING btree ("_path");
  CREATE INDEX "services_blocks_testimonial_testimonials_order_idx" ON "services_blocks_testimonial_testimonials" USING btree ("_order");
  CREATE INDEX "services_blocks_testimonial_testimonials_parent_id_idx" ON "services_blocks_testimonial_testimonials" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_testimonial_testimonials_avatar_idx" ON "services_blocks_testimonial_testimonials" USING btree ("avatar_id");
  CREATE INDEX "services_blocks_testimonial_order_idx" ON "services_blocks_testimonial" USING btree ("_order");
  CREATE INDEX "services_blocks_testimonial_parent_id_idx" ON "services_blocks_testimonial" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_testimonial_path_idx" ON "services_blocks_testimonial" USING btree ("_path");
  CREATE INDEX "services_blocks_feature_grid_features_order_idx" ON "services_blocks_feature_grid_features" USING btree ("_order");
  CREATE INDEX "services_blocks_feature_grid_features_parent_id_idx" ON "services_blocks_feature_grid_features" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_feature_grid_order_idx" ON "services_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "services_blocks_feature_grid_parent_id_idx" ON "services_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_feature_grid_path_idx" ON "services_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "services_blocks_stats_counter_stats_order_idx" ON "services_blocks_stats_counter_stats" USING btree ("_order");
  CREATE INDEX "services_blocks_stats_counter_stats_parent_id_idx" ON "services_blocks_stats_counter_stats" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_stats_counter_order_idx" ON "services_blocks_stats_counter" USING btree ("_order");
  CREATE INDEX "services_blocks_stats_counter_parent_id_idx" ON "services_blocks_stats_counter" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_stats_counter_path_idx" ON "services_blocks_stats_counter" USING btree ("_path");
  CREATE INDEX "services_blocks_faq_accordion_faqs_order_idx" ON "services_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "services_blocks_faq_accordion_faqs_parent_id_idx" ON "services_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_faq_accordion_order_idx" ON "services_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "services_blocks_faq_accordion_parent_id_idx" ON "services_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_faq_accordion_path_idx" ON "services_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "services_blocks_contact_form_order_idx" ON "services_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "services_blocks_contact_form_parent_id_idx" ON "services_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_contact_form_path_idx" ON "services_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "services_blocks_contact_form_form_idx" ON "services_blocks_contact_form" USING btree ("form_id");
  CREATE INDEX "services_blocks_newsletter_order_idx" ON "services_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "services_blocks_newsletter_parent_id_idx" ON "services_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_newsletter_path_idx" ON "services_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "services_blocks_social_proof_logos_order_idx" ON "services_blocks_social_proof_logos" USING btree ("_order");
  CREATE INDEX "services_blocks_social_proof_logos_parent_id_idx" ON "services_blocks_social_proof_logos" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_social_proof_logos_image_idx" ON "services_blocks_social_proof_logos" USING btree ("image_id");
  CREATE INDEX "services_blocks_social_proof_stats_order_idx" ON "services_blocks_social_proof_stats" USING btree ("_order");
  CREATE INDEX "services_blocks_social_proof_stats_parent_id_idx" ON "services_blocks_social_proof_stats" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_social_proof_badges_order_idx" ON "services_blocks_social_proof_badges" USING btree ("_order");
  CREATE INDEX "services_blocks_social_proof_badges_parent_id_idx" ON "services_blocks_social_proof_badges" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_social_proof_badges_image_idx" ON "services_blocks_social_proof_badges" USING btree ("image_id");
  CREATE INDEX "services_blocks_social_proof_order_idx" ON "services_blocks_social_proof" USING btree ("_order");
  CREATE INDEX "services_blocks_social_proof_parent_id_idx" ON "services_blocks_social_proof" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_social_proof_path_idx" ON "services_blocks_social_proof" USING btree ("_path");
  CREATE INDEX "services_blocks_container_order_idx" ON "services_blocks_container" USING btree ("_order");
  CREATE INDEX "services_blocks_container_parent_id_idx" ON "services_blocks_container" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_container_path_idx" ON "services_blocks_container" USING btree ("_path");
  CREATE INDEX "services_blocks_container_background_image_idx" ON "services_blocks_container" USING btree ("background_image_id");
  CREATE INDEX "services_blocks_divider_order_idx" ON "services_blocks_divider" USING btree ("_order");
  CREATE INDEX "services_blocks_divider_parent_id_idx" ON "services_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_divider_path_idx" ON "services_blocks_divider" USING btree ("_path");
  CREATE INDEX "services_blocks_spacer_order_idx" ON "services_blocks_spacer" USING btree ("_order");
  CREATE INDEX "services_blocks_spacer_parent_id_idx" ON "services_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "services_blocks_spacer_path_idx" ON "services_blocks_spacer" USING btree ("_path");
  CREATE INDEX "services_meta_meta_image_idx" ON "services" USING btree ("meta_image_id");
  CREATE INDEX "services_meta_structured_meta_structured_author_idx" ON "services" USING btree ("meta_structured_author_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_created_by_idx" ON "services" USING btree ("created_by_id");
  CREATE INDEX "services_updated_by_idx" ON "services" USING btree ("updated_by_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_pages_id_idx" ON "services_rels" USING btree ("pages_id");
  CREATE INDEX "services_rels_blogs_id_idx" ON "services_rels" USING btree ("blogs_id");
  CREATE INDEX "services_rels_services_id_idx" ON "services_rels" USING btree ("services_id");
  CREATE INDEX "services_rels_legal_id_idx" ON "services_rels" USING btree ("legal_id");
  CREATE INDEX "services_rels_contacts_id_idx" ON "services_rels" USING btree ("contacts_id");
  CREATE INDEX "_services_v_blocks_hero_gradient_config_colors_order_idx" ON "_services_v_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_hero_gradient_config_colors_parent_id_idx" ON "_services_v_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_hero_actions_order_idx" ON "_services_v_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_hero_actions_parent_id_idx" ON "_services_v_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_hero_order_idx" ON "_services_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_hero_parent_id_idx" ON "_services_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_hero_path_idx" ON "_services_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_hero_media_idx" ON "_services_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_services_v_blocks_content_columns_order_idx" ON "_services_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_content_columns_parent_id_idx" ON "_services_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_content_order_idx" ON "_services_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_content_parent_id_idx" ON "_services_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_content_path_idx" ON "_services_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_media_block_order_idx" ON "_services_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_media_block_parent_id_idx" ON "_services_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_media_block_path_idx" ON "_services_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_media_block_media_idx" ON "_services_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_services_v_blocks_cta_links_order_idx" ON "_services_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_cta_links_parent_id_idx" ON "_services_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_cta_order_idx" ON "_services_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_cta_parent_id_idx" ON "_services_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_cta_path_idx" ON "_services_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_cta_media_idx" ON "_services_v_blocks_cta" USING btree ("media_id");
  CREATE INDEX "_services_v_blocks_services_grid_services_features_order_idx" ON "_services_v_blocks_services_grid_services_features" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_services_grid_services_features_parent_id_idx" ON "_services_v_blocks_services_grid_services_features" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_services_grid_services_order_idx" ON "_services_v_blocks_services_grid_services" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_services_grid_services_parent_id_idx" ON "_services_v_blocks_services_grid_services" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_services_grid_order_idx" ON "_services_v_blocks_services_grid" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_services_grid_parent_id_idx" ON "_services_v_blocks_services_grid" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_services_grid_path_idx" ON "_services_v_blocks_services_grid" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_tech_stack_technologies_order_idx" ON "_services_v_blocks_tech_stack_technologies" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_tech_stack_technologies_parent_id_idx" ON "_services_v_blocks_tech_stack_technologies" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_tech_stack_technologies_icon_idx" ON "_services_v_blocks_tech_stack_technologies" USING btree ("icon_id");
  CREATE INDEX "_services_v_blocks_tech_stack_order_idx" ON "_services_v_blocks_tech_stack" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_tech_stack_parent_id_idx" ON "_services_v_blocks_tech_stack" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_tech_stack_path_idx" ON "_services_v_blocks_tech_stack" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_process_steps_steps_order_idx" ON "_services_v_blocks_process_steps_steps" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_process_steps_steps_parent_id_idx" ON "_services_v_blocks_process_steps_steps" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_process_steps_order_idx" ON "_services_v_blocks_process_steps" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_process_steps_parent_id_idx" ON "_services_v_blocks_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_process_steps_path_idx" ON "_services_v_blocks_process_steps" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_pricing_table_tiers_features_order_idx" ON "_services_v_blocks_pricing_table_tiers_features" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_pricing_table_tiers_features_parent_id_idx" ON "_services_v_blocks_pricing_table_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_pricing_table_tiers_order_idx" ON "_services_v_blocks_pricing_table_tiers" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_pricing_table_tiers_parent_id_idx" ON "_services_v_blocks_pricing_table_tiers" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_pricing_table_order_idx" ON "_services_v_blocks_pricing_table" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_pricing_table_parent_id_idx" ON "_services_v_blocks_pricing_table" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_pricing_table_path_idx" ON "_services_v_blocks_pricing_table" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_testimonial_testimonials_order_idx" ON "_services_v_blocks_testimonial_testimonials" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_testimonial_testimonials_parent_id_idx" ON "_services_v_blocks_testimonial_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_testimonial_testimonials_avatar_idx" ON "_services_v_blocks_testimonial_testimonials" USING btree ("avatar_id");
  CREATE INDEX "_services_v_blocks_testimonial_order_idx" ON "_services_v_blocks_testimonial" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_testimonial_parent_id_idx" ON "_services_v_blocks_testimonial" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_testimonial_path_idx" ON "_services_v_blocks_testimonial" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_feature_grid_features_order_idx" ON "_services_v_blocks_feature_grid_features" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_feature_grid_features_parent_id_idx" ON "_services_v_blocks_feature_grid_features" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_feature_grid_order_idx" ON "_services_v_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_feature_grid_parent_id_idx" ON "_services_v_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_feature_grid_path_idx" ON "_services_v_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_stats_counter_stats_order_idx" ON "_services_v_blocks_stats_counter_stats" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_stats_counter_stats_parent_id_idx" ON "_services_v_blocks_stats_counter_stats" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_stats_counter_order_idx" ON "_services_v_blocks_stats_counter" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_stats_counter_parent_id_idx" ON "_services_v_blocks_stats_counter" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_stats_counter_path_idx" ON "_services_v_blocks_stats_counter" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_faq_accordion_faqs_order_idx" ON "_services_v_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_faq_accordion_faqs_parent_id_idx" ON "_services_v_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_faq_accordion_order_idx" ON "_services_v_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_faq_accordion_parent_id_idx" ON "_services_v_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_faq_accordion_path_idx" ON "_services_v_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_contact_form_order_idx" ON "_services_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_contact_form_parent_id_idx" ON "_services_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_contact_form_path_idx" ON "_services_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_contact_form_form_idx" ON "_services_v_blocks_contact_form" USING btree ("form_id");
  CREATE INDEX "_services_v_blocks_newsletter_order_idx" ON "_services_v_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_newsletter_parent_id_idx" ON "_services_v_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_newsletter_path_idx" ON "_services_v_blocks_newsletter" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_social_proof_logos_order_idx" ON "_services_v_blocks_social_proof_logos" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_social_proof_logos_parent_id_idx" ON "_services_v_blocks_social_proof_logos" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_social_proof_logos_image_idx" ON "_services_v_blocks_social_proof_logos" USING btree ("image_id");
  CREATE INDEX "_services_v_blocks_social_proof_stats_order_idx" ON "_services_v_blocks_social_proof_stats" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_social_proof_stats_parent_id_idx" ON "_services_v_blocks_social_proof_stats" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_social_proof_badges_order_idx" ON "_services_v_blocks_social_proof_badges" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_social_proof_badges_parent_id_idx" ON "_services_v_blocks_social_proof_badges" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_social_proof_badges_image_idx" ON "_services_v_blocks_social_proof_badges" USING btree ("image_id");
  CREATE INDEX "_services_v_blocks_social_proof_order_idx" ON "_services_v_blocks_social_proof" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_social_proof_parent_id_idx" ON "_services_v_blocks_social_proof" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_social_proof_path_idx" ON "_services_v_blocks_social_proof" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_container_order_idx" ON "_services_v_blocks_container" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_container_parent_id_idx" ON "_services_v_blocks_container" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_container_path_idx" ON "_services_v_blocks_container" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_container_background_image_idx" ON "_services_v_blocks_container" USING btree ("background_image_id");
  CREATE INDEX "_services_v_blocks_divider_order_idx" ON "_services_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_divider_parent_id_idx" ON "_services_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_divider_path_idx" ON "_services_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_services_v_blocks_spacer_order_idx" ON "_services_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_services_v_blocks_spacer_parent_id_idx" ON "_services_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_services_v_blocks_spacer_path_idx" ON "_services_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_meta_version_meta_image_idx" ON "_services_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_services_v_version_meta_structured_version_meta_structu_idx" ON "_services_v" USING btree ("version_meta_structured_author_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_created_by_idx" ON "_services_v" USING btree ("version_created_by_id");
  CREATE INDEX "_services_v_version_version_updated_by_idx" ON "_services_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "_services_v_autosave_idx" ON "_services_v" USING btree ("autosave");
  CREATE INDEX "_services_v_rels_order_idx" ON "_services_v_rels" USING btree ("order");
  CREATE INDEX "_services_v_rels_parent_idx" ON "_services_v_rels" USING btree ("parent_id");
  CREATE INDEX "_services_v_rels_path_idx" ON "_services_v_rels" USING btree ("path");
  CREATE INDEX "_services_v_rels_pages_id_idx" ON "_services_v_rels" USING btree ("pages_id");
  CREATE INDEX "_services_v_rels_blogs_id_idx" ON "_services_v_rels" USING btree ("blogs_id");
  CREATE INDEX "_services_v_rels_services_id_idx" ON "_services_v_rels" USING btree ("services_id");
  CREATE INDEX "_services_v_rels_legal_id_idx" ON "_services_v_rels" USING btree ("legal_id");
  CREATE INDEX "_services_v_rels_contacts_id_idx" ON "_services_v_rels" USING btree ("contacts_id");
  CREATE INDEX "legal_blocks_content_columns_order_idx" ON "legal_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "legal_blocks_content_columns_parent_id_idx" ON "legal_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "legal_blocks_content_order_idx" ON "legal_blocks_content" USING btree ("_order");
  CREATE INDEX "legal_blocks_content_parent_id_idx" ON "legal_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "legal_blocks_content_path_idx" ON "legal_blocks_content" USING btree ("_path");
  CREATE INDEX "legal_blocks_banner_order_idx" ON "legal_blocks_banner" USING btree ("_order");
  CREATE INDEX "legal_blocks_banner_parent_id_idx" ON "legal_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "legal_blocks_banner_path_idx" ON "legal_blocks_banner" USING btree ("_path");
  CREATE INDEX "legal_blocks_faq_accordion_faqs_order_idx" ON "legal_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "legal_blocks_faq_accordion_faqs_parent_id_idx" ON "legal_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "legal_blocks_faq_accordion_order_idx" ON "legal_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "legal_blocks_faq_accordion_parent_id_idx" ON "legal_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "legal_blocks_faq_accordion_path_idx" ON "legal_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "legal_blocks_container_order_idx" ON "legal_blocks_container" USING btree ("_order");
  CREATE INDEX "legal_blocks_container_parent_id_idx" ON "legal_blocks_container" USING btree ("_parent_id");
  CREATE INDEX "legal_blocks_container_path_idx" ON "legal_blocks_container" USING btree ("_path");
  CREATE INDEX "legal_blocks_container_background_image_idx" ON "legal_blocks_container" USING btree ("background_image_id");
  CREATE INDEX "legal_blocks_divider_order_idx" ON "legal_blocks_divider" USING btree ("_order");
  CREATE INDEX "legal_blocks_divider_parent_id_idx" ON "legal_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "legal_blocks_divider_path_idx" ON "legal_blocks_divider" USING btree ("_path");
  CREATE INDEX "legal_blocks_spacer_order_idx" ON "legal_blocks_spacer" USING btree ("_order");
  CREATE INDEX "legal_blocks_spacer_parent_id_idx" ON "legal_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "legal_blocks_spacer_path_idx" ON "legal_blocks_spacer" USING btree ("_path");
  CREATE INDEX "legal_meta_meta_image_idx" ON "legal" USING btree ("meta_image_id");
  CREATE INDEX "legal_meta_structured_meta_structured_author_idx" ON "legal" USING btree ("meta_structured_author_id");
  CREATE UNIQUE INDEX "legal_slug_idx" ON "legal" USING btree ("slug");
  CREATE INDEX "legal_created_by_idx" ON "legal" USING btree ("created_by_id");
  CREATE INDEX "legal_updated_by_idx" ON "legal" USING btree ("updated_by_id");
  CREATE INDEX "legal_updated_at_idx" ON "legal" USING btree ("updated_at");
  CREATE INDEX "legal_created_at_idx" ON "legal" USING btree ("created_at");
  CREATE INDEX "legal__status_idx" ON "legal" USING btree ("_status");
  CREATE INDEX "legal_rels_order_idx" ON "legal_rels" USING btree ("order");
  CREATE INDEX "legal_rels_parent_idx" ON "legal_rels" USING btree ("parent_id");
  CREATE INDEX "legal_rels_path_idx" ON "legal_rels" USING btree ("path");
  CREATE INDEX "legal_rels_pages_id_idx" ON "legal_rels" USING btree ("pages_id");
  CREATE INDEX "legal_rels_blogs_id_idx" ON "legal_rels" USING btree ("blogs_id");
  CREATE INDEX "legal_rels_services_id_idx" ON "legal_rels" USING btree ("services_id");
  CREATE INDEX "legal_rels_legal_id_idx" ON "legal_rels" USING btree ("legal_id");
  CREATE INDEX "legal_rels_contacts_id_idx" ON "legal_rels" USING btree ("contacts_id");
  CREATE INDEX "_legal_v_blocks_content_columns_order_idx" ON "_legal_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_legal_v_blocks_content_columns_parent_id_idx" ON "_legal_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_blocks_content_order_idx" ON "_legal_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_legal_v_blocks_content_parent_id_idx" ON "_legal_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_blocks_content_path_idx" ON "_legal_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_legal_v_blocks_banner_order_idx" ON "_legal_v_blocks_banner" USING btree ("_order");
  CREATE INDEX "_legal_v_blocks_banner_parent_id_idx" ON "_legal_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_blocks_banner_path_idx" ON "_legal_v_blocks_banner" USING btree ("_path");
  CREATE INDEX "_legal_v_blocks_faq_accordion_faqs_order_idx" ON "_legal_v_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "_legal_v_blocks_faq_accordion_faqs_parent_id_idx" ON "_legal_v_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_blocks_faq_accordion_order_idx" ON "_legal_v_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "_legal_v_blocks_faq_accordion_parent_id_idx" ON "_legal_v_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_blocks_faq_accordion_path_idx" ON "_legal_v_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "_legal_v_blocks_container_order_idx" ON "_legal_v_blocks_container" USING btree ("_order");
  CREATE INDEX "_legal_v_blocks_container_parent_id_idx" ON "_legal_v_blocks_container" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_blocks_container_path_idx" ON "_legal_v_blocks_container" USING btree ("_path");
  CREATE INDEX "_legal_v_blocks_container_background_image_idx" ON "_legal_v_blocks_container" USING btree ("background_image_id");
  CREATE INDEX "_legal_v_blocks_divider_order_idx" ON "_legal_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_legal_v_blocks_divider_parent_id_idx" ON "_legal_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_blocks_divider_path_idx" ON "_legal_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_legal_v_blocks_spacer_order_idx" ON "_legal_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_legal_v_blocks_spacer_parent_id_idx" ON "_legal_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_legal_v_blocks_spacer_path_idx" ON "_legal_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_legal_v_parent_idx" ON "_legal_v" USING btree ("parent_id");
  CREATE INDEX "_legal_v_version_meta_version_meta_image_idx" ON "_legal_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_legal_v_version_meta_structured_version_meta_structured_idx" ON "_legal_v" USING btree ("version_meta_structured_author_id");
  CREATE INDEX "_legal_v_version_version_slug_idx" ON "_legal_v" USING btree ("version_slug");
  CREATE INDEX "_legal_v_version_version_created_by_idx" ON "_legal_v" USING btree ("version_created_by_id");
  CREATE INDEX "_legal_v_version_version_updated_by_idx" ON "_legal_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_legal_v_version_version_updated_at_idx" ON "_legal_v" USING btree ("version_updated_at");
  CREATE INDEX "_legal_v_version_version_created_at_idx" ON "_legal_v" USING btree ("version_created_at");
  CREATE INDEX "_legal_v_version_version__status_idx" ON "_legal_v" USING btree ("version__status");
  CREATE INDEX "_legal_v_created_at_idx" ON "_legal_v" USING btree ("created_at");
  CREATE INDEX "_legal_v_updated_at_idx" ON "_legal_v" USING btree ("updated_at");
  CREATE INDEX "_legal_v_latest_idx" ON "_legal_v" USING btree ("latest");
  CREATE INDEX "_legal_v_autosave_idx" ON "_legal_v" USING btree ("autosave");
  CREATE INDEX "_legal_v_rels_order_idx" ON "_legal_v_rels" USING btree ("order");
  CREATE INDEX "_legal_v_rels_parent_idx" ON "_legal_v_rels" USING btree ("parent_id");
  CREATE INDEX "_legal_v_rels_path_idx" ON "_legal_v_rels" USING btree ("path");
  CREATE INDEX "_legal_v_rels_pages_id_idx" ON "_legal_v_rels" USING btree ("pages_id");
  CREATE INDEX "_legal_v_rels_blogs_id_idx" ON "_legal_v_rels" USING btree ("blogs_id");
  CREATE INDEX "_legal_v_rels_services_id_idx" ON "_legal_v_rels" USING btree ("services_id");
  CREATE INDEX "_legal_v_rels_legal_id_idx" ON "_legal_v_rels" USING btree ("legal_id");
  CREATE INDEX "_legal_v_rels_contacts_id_idx" ON "_legal_v_rels" USING btree ("contacts_id");
  CREATE INDEX "contacts_blocks_hero_gradient_config_colors_order_idx" ON "contacts_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "contacts_blocks_hero_gradient_config_colors_parent_id_idx" ON "contacts_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_hero_actions_order_idx" ON "contacts_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "contacts_blocks_hero_actions_parent_id_idx" ON "contacts_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_hero_order_idx" ON "contacts_blocks_hero" USING btree ("_order");
  CREATE INDEX "contacts_blocks_hero_parent_id_idx" ON "contacts_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_hero_path_idx" ON "contacts_blocks_hero" USING btree ("_path");
  CREATE INDEX "contacts_blocks_hero_media_idx" ON "contacts_blocks_hero" USING btree ("media_id");
  CREATE INDEX "contacts_blocks_content_columns_order_idx" ON "contacts_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "contacts_blocks_content_columns_parent_id_idx" ON "contacts_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_content_order_idx" ON "contacts_blocks_content" USING btree ("_order");
  CREATE INDEX "contacts_blocks_content_parent_id_idx" ON "contacts_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_content_path_idx" ON "contacts_blocks_content" USING btree ("_path");
  CREATE INDEX "contacts_blocks_media_block_order_idx" ON "contacts_blocks_media_block" USING btree ("_order");
  CREATE INDEX "contacts_blocks_media_block_parent_id_idx" ON "contacts_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_media_block_path_idx" ON "contacts_blocks_media_block" USING btree ("_path");
  CREATE INDEX "contacts_blocks_media_block_media_idx" ON "contacts_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "contacts_blocks_contact_form_order_idx" ON "contacts_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "contacts_blocks_contact_form_parent_id_idx" ON "contacts_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_contact_form_path_idx" ON "contacts_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "contacts_blocks_contact_form_form_idx" ON "contacts_blocks_contact_form" USING btree ("form_id");
  CREATE INDEX "contacts_blocks_social_proof_logos_order_idx" ON "contacts_blocks_social_proof_logos" USING btree ("_order");
  CREATE INDEX "contacts_blocks_social_proof_logos_parent_id_idx" ON "contacts_blocks_social_proof_logos" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_social_proof_logos_image_idx" ON "contacts_blocks_social_proof_logos" USING btree ("image_id");
  CREATE INDEX "contacts_blocks_social_proof_stats_order_idx" ON "contacts_blocks_social_proof_stats" USING btree ("_order");
  CREATE INDEX "contacts_blocks_social_proof_stats_parent_id_idx" ON "contacts_blocks_social_proof_stats" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_social_proof_badges_order_idx" ON "contacts_blocks_social_proof_badges" USING btree ("_order");
  CREATE INDEX "contacts_blocks_social_proof_badges_parent_id_idx" ON "contacts_blocks_social_proof_badges" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_social_proof_badges_image_idx" ON "contacts_blocks_social_proof_badges" USING btree ("image_id");
  CREATE INDEX "contacts_blocks_social_proof_order_idx" ON "contacts_blocks_social_proof" USING btree ("_order");
  CREATE INDEX "contacts_blocks_social_proof_parent_id_idx" ON "contacts_blocks_social_proof" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_social_proof_path_idx" ON "contacts_blocks_social_proof" USING btree ("_path");
  CREATE INDEX "contacts_blocks_faq_accordion_faqs_order_idx" ON "contacts_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "contacts_blocks_faq_accordion_faqs_parent_id_idx" ON "contacts_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_faq_accordion_order_idx" ON "contacts_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "contacts_blocks_faq_accordion_parent_id_idx" ON "contacts_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_faq_accordion_path_idx" ON "contacts_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "contacts_blocks_container_order_idx" ON "contacts_blocks_container" USING btree ("_order");
  CREATE INDEX "contacts_blocks_container_parent_id_idx" ON "contacts_blocks_container" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_container_path_idx" ON "contacts_blocks_container" USING btree ("_path");
  CREATE INDEX "contacts_blocks_container_background_image_idx" ON "contacts_blocks_container" USING btree ("background_image_id");
  CREATE INDEX "contacts_blocks_divider_order_idx" ON "contacts_blocks_divider" USING btree ("_order");
  CREATE INDEX "contacts_blocks_divider_parent_id_idx" ON "contacts_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_divider_path_idx" ON "contacts_blocks_divider" USING btree ("_path");
  CREATE INDEX "contacts_blocks_spacer_order_idx" ON "contacts_blocks_spacer" USING btree ("_order");
  CREATE INDEX "contacts_blocks_spacer_parent_id_idx" ON "contacts_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "contacts_blocks_spacer_path_idx" ON "contacts_blocks_spacer" USING btree ("_path");
  CREATE INDEX "contacts_contact_info_sections_order_idx" ON "contacts_contact_info_sections" USING btree ("order");
  CREATE INDEX "contacts_contact_info_sections_parent_idx" ON "contacts_contact_info_sections" USING btree ("parent_id");
  CREATE INDEX "contacts_form_idx" ON "contacts" USING btree ("form_id");
  CREATE INDEX "contacts_meta_meta_image_idx" ON "contacts" USING btree ("meta_image_id");
  CREATE INDEX "contacts_meta_structured_meta_structured_author_idx" ON "contacts" USING btree ("meta_structured_author_id");
  CREATE UNIQUE INDEX "contacts_slug_idx" ON "contacts" USING btree ("slug");
  CREATE INDEX "contacts_created_by_idx" ON "contacts" USING btree ("created_by_id");
  CREATE INDEX "contacts_updated_by_idx" ON "contacts" USING btree ("updated_by_id");
  CREATE INDEX "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE INDEX "contacts__status_idx" ON "contacts" USING btree ("_status");
  CREATE INDEX "contacts_rels_order_idx" ON "contacts_rels" USING btree ("order");
  CREATE INDEX "contacts_rels_parent_idx" ON "contacts_rels" USING btree ("parent_id");
  CREATE INDEX "contacts_rels_path_idx" ON "contacts_rels" USING btree ("path");
  CREATE INDEX "contacts_rels_pages_id_idx" ON "contacts_rels" USING btree ("pages_id");
  CREATE INDEX "contacts_rels_blogs_id_idx" ON "contacts_rels" USING btree ("blogs_id");
  CREATE INDEX "contacts_rels_services_id_idx" ON "contacts_rels" USING btree ("services_id");
  CREATE INDEX "contacts_rels_legal_id_idx" ON "contacts_rels" USING btree ("legal_id");
  CREATE INDEX "contacts_rels_contacts_id_idx" ON "contacts_rels" USING btree ("contacts_id");
  CREATE INDEX "_contacts_v_blocks_hero_gradient_config_colors_order_idx" ON "_contacts_v_blocks_hero_gradient_config_colors" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_hero_gradient_config_colors_parent_id_idx" ON "_contacts_v_blocks_hero_gradient_config_colors" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_hero_actions_order_idx" ON "_contacts_v_blocks_hero_actions" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_hero_actions_parent_id_idx" ON "_contacts_v_blocks_hero_actions" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_hero_order_idx" ON "_contacts_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_hero_parent_id_idx" ON "_contacts_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_hero_path_idx" ON "_contacts_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_contacts_v_blocks_hero_media_idx" ON "_contacts_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_contacts_v_blocks_content_columns_order_idx" ON "_contacts_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_content_columns_parent_id_idx" ON "_contacts_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_content_order_idx" ON "_contacts_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_content_parent_id_idx" ON "_contacts_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_content_path_idx" ON "_contacts_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_contacts_v_blocks_media_block_order_idx" ON "_contacts_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_media_block_parent_id_idx" ON "_contacts_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_media_block_path_idx" ON "_contacts_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_contacts_v_blocks_media_block_media_idx" ON "_contacts_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_contacts_v_blocks_contact_form_order_idx" ON "_contacts_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_contact_form_parent_id_idx" ON "_contacts_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_contact_form_path_idx" ON "_contacts_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_contacts_v_blocks_contact_form_form_idx" ON "_contacts_v_blocks_contact_form" USING btree ("form_id");
  CREATE INDEX "_contacts_v_blocks_social_proof_logos_order_idx" ON "_contacts_v_blocks_social_proof_logos" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_social_proof_logos_parent_id_idx" ON "_contacts_v_blocks_social_proof_logos" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_social_proof_logos_image_idx" ON "_contacts_v_blocks_social_proof_logos" USING btree ("image_id");
  CREATE INDEX "_contacts_v_blocks_social_proof_stats_order_idx" ON "_contacts_v_blocks_social_proof_stats" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_social_proof_stats_parent_id_idx" ON "_contacts_v_blocks_social_proof_stats" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_social_proof_badges_order_idx" ON "_contacts_v_blocks_social_proof_badges" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_social_proof_badges_parent_id_idx" ON "_contacts_v_blocks_social_proof_badges" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_social_proof_badges_image_idx" ON "_contacts_v_blocks_social_proof_badges" USING btree ("image_id");
  CREATE INDEX "_contacts_v_blocks_social_proof_order_idx" ON "_contacts_v_blocks_social_proof" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_social_proof_parent_id_idx" ON "_contacts_v_blocks_social_proof" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_social_proof_path_idx" ON "_contacts_v_blocks_social_proof" USING btree ("_path");
  CREATE INDEX "_contacts_v_blocks_faq_accordion_faqs_order_idx" ON "_contacts_v_blocks_faq_accordion_faqs" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_faq_accordion_faqs_parent_id_idx" ON "_contacts_v_blocks_faq_accordion_faqs" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_faq_accordion_order_idx" ON "_contacts_v_blocks_faq_accordion" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_faq_accordion_parent_id_idx" ON "_contacts_v_blocks_faq_accordion" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_faq_accordion_path_idx" ON "_contacts_v_blocks_faq_accordion" USING btree ("_path");
  CREATE INDEX "_contacts_v_blocks_container_order_idx" ON "_contacts_v_blocks_container" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_container_parent_id_idx" ON "_contacts_v_blocks_container" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_container_path_idx" ON "_contacts_v_blocks_container" USING btree ("_path");
  CREATE INDEX "_contacts_v_blocks_container_background_image_idx" ON "_contacts_v_blocks_container" USING btree ("background_image_id");
  CREATE INDEX "_contacts_v_blocks_divider_order_idx" ON "_contacts_v_blocks_divider" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_divider_parent_id_idx" ON "_contacts_v_blocks_divider" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_divider_path_idx" ON "_contacts_v_blocks_divider" USING btree ("_path");
  CREATE INDEX "_contacts_v_blocks_spacer_order_idx" ON "_contacts_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_contacts_v_blocks_spacer_parent_id_idx" ON "_contacts_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_contacts_v_blocks_spacer_path_idx" ON "_contacts_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_contacts_v_version_contact_info_sections_order_idx" ON "_contacts_v_version_contact_info_sections" USING btree ("order");
  CREATE INDEX "_contacts_v_version_contact_info_sections_parent_idx" ON "_contacts_v_version_contact_info_sections" USING btree ("parent_id");
  CREATE INDEX "_contacts_v_parent_idx" ON "_contacts_v" USING btree ("parent_id");
  CREATE INDEX "_contacts_v_version_version_form_idx" ON "_contacts_v" USING btree ("version_form_id");
  CREATE INDEX "_contacts_v_version_meta_version_meta_image_idx" ON "_contacts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_contacts_v_version_meta_structured_version_meta_structu_idx" ON "_contacts_v" USING btree ("version_meta_structured_author_id");
  CREATE INDEX "_contacts_v_version_version_slug_idx" ON "_contacts_v" USING btree ("version_slug");
  CREATE INDEX "_contacts_v_version_version_created_by_idx" ON "_contacts_v" USING btree ("version_created_by_id");
  CREATE INDEX "_contacts_v_version_version_updated_by_idx" ON "_contacts_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_contacts_v_version_version_updated_at_idx" ON "_contacts_v" USING btree ("version_updated_at");
  CREATE INDEX "_contacts_v_version_version_created_at_idx" ON "_contacts_v" USING btree ("version_created_at");
  CREATE INDEX "_contacts_v_version_version__status_idx" ON "_contacts_v" USING btree ("version__status");
  CREATE INDEX "_contacts_v_created_at_idx" ON "_contacts_v" USING btree ("created_at");
  CREATE INDEX "_contacts_v_updated_at_idx" ON "_contacts_v" USING btree ("updated_at");
  CREATE INDEX "_contacts_v_latest_idx" ON "_contacts_v" USING btree ("latest");
  CREATE INDEX "_contacts_v_autosave_idx" ON "_contacts_v" USING btree ("autosave");
  CREATE INDEX "_contacts_v_rels_order_idx" ON "_contacts_v_rels" USING btree ("order");
  CREATE INDEX "_contacts_v_rels_parent_idx" ON "_contacts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_contacts_v_rels_path_idx" ON "_contacts_v_rels" USING btree ("path");
  CREATE INDEX "_contacts_v_rels_pages_id_idx" ON "_contacts_v_rels" USING btree ("pages_id");
  CREATE INDEX "_contacts_v_rels_blogs_id_idx" ON "_contacts_v_rels" USING btree ("blogs_id");
  CREATE INDEX "_contacts_v_rels_services_id_idx" ON "_contacts_v_rels" USING btree ("services_id");
  CREATE INDEX "_contacts_v_rels_legal_id_idx" ON "_contacts_v_rels" USING btree ("legal_id");
  CREATE INDEX "_contacts_v_rels_contacts_id_idx" ON "_contacts_v_rels" USING btree ("contacts_id");
  CREATE INDEX "analytics_data_updated_at_idx" ON "analytics_data" USING btree ("updated_at");
  CREATE INDEX "analytics_data_created_at_idx" ON "analytics_data" USING btree ("created_at");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_email_notifications_recipients_order_idx" ON "forms_email_notifications_recipients" USING btree ("_order");
  CREATE INDEX "forms_email_notifications_recipients_parent_id_idx" ON "forms_email_notifications_recipients" USING btree ("_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_blogs_id_idx" ON "payload_locked_documents_rels" USING btree ("blogs_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_legal_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_id");
  CREATE INDEX "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX "payload_locked_documents_rels_analytics_data_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_data_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_description_order_idx" ON "header_description" USING btree ("_order");
  CREATE INDEX "header_description_parent_id_idx" ON "header_description" USING btree ("_parent_id");
  CREATE INDEX "header_featured_order_idx" ON "header_featured" USING btree ("_order");
  CREATE INDEX "header_featured_parent_id_idx" ON "header_featured" USING btree ("_parent_id");
  CREATE INDEX "header_list_order_idx" ON "header_list" USING btree ("_order");
  CREATE INDEX "header_list_parent_id_idx" ON "header_list" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_tabs_order_idx" ON "header_tabs" USING btree ("_order");
  CREATE INDEX "header_tabs_parent_id_idx" ON "header_tabs" USING btree ("_parent_id");
  CREATE INDEX "header_meta_meta_image_idx" ON "header" USING btree ("meta_image_id");
  CREATE INDEX "header_meta_structured_meta_structured_author_idx" ON "header" USING btree ("meta_structured_author_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_blogs_id_idx" ON "header_rels" USING btree ("blogs_id");
  CREATE INDEX "header_rels_services_id_idx" ON "header_rels" USING btree ("services_id");
  CREATE INDEX "header_rels_legal_id_idx" ON "header_rels" USING btree ("legal_id");
  CREATE INDEX "header_rels_contacts_id_idx" ON "header_rels" USING btree ("contacts_id");
  CREATE INDEX "footer_columns_nav_items_order_idx" ON "footer_columns_nav_items" USING btree ("_order");
  CREATE INDEX "footer_columns_nav_items_parent_id_idx" ON "footer_columns_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE INDEX "footer_meta_meta_image_idx" ON "footer" USING btree ("meta_image_id");
  CREATE INDEX "footer_meta_structured_meta_structured_author_idx" ON "footer" USING btree ("meta_structured_author_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_blogs_id_idx" ON "footer_rels" USING btree ("blogs_id");
  CREATE INDEX "footer_rels_services_id_idx" ON "footer_rels" USING btree ("services_id");
  CREATE INDEX "footer_rels_legal_id_idx" ON "footer_rels" USING btree ("legal_id");
  CREATE INDEX "footer_rels_contacts_id_idx" ON "footer_rels" USING btree ("contacts_id");
  CREATE INDEX "contact_social_media_links_order_idx" ON "contact_social_media_links" USING btree ("_order");
  CREATE INDEX "contact_social_media_links_parent_id_idx" ON "contact_social_media_links" USING btree ("_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "pages_blocks_hero_actions" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "pages_blocks_banner" CASCADE;
  DROP TABLE "pages_blocks_code" CASCADE;
  DROP TABLE "pages_blocks_services_grid_services_features" CASCADE;
  DROP TABLE "pages_blocks_services_grid_services" CASCADE;
  DROP TABLE "pages_blocks_services_grid" CASCADE;
  DROP TABLE "pages_blocks_tech_stack_technologies" CASCADE;
  DROP TABLE "pages_blocks_tech_stack" CASCADE;
  DROP TABLE "pages_blocks_process_steps_steps" CASCADE;
  DROP TABLE "pages_blocks_process_steps" CASCADE;
  DROP TABLE "pages_blocks_pricing_table_tiers_features" CASCADE;
  DROP TABLE "pages_blocks_pricing_table_tiers" CASCADE;
  DROP TABLE "pages_blocks_pricing_table" CASCADE;
  DROP TABLE "pages_blocks_project_showcase_projects_technologies" CASCADE;
  DROP TABLE "pages_blocks_project_showcase_projects" CASCADE;
  DROP TABLE "pages_blocks_project_showcase_filter_categories" CASCADE;
  DROP TABLE "pages_blocks_project_showcase" CASCADE;
  DROP TABLE "pages_blocks_case_study_approach_steps" CASCADE;
  DROP TABLE "pages_blocks_case_study_solution_technologies" CASCADE;
  DROP TABLE "pages_blocks_case_study_results_metrics" CASCADE;
  DROP TABLE "pages_blocks_case_study" CASCADE;
  DROP TABLE "pages_blocks_before_after" CASCADE;
  DROP TABLE "pages_blocks_testimonial_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonial" CASCADE;
  DROP TABLE "pages_blocks_feature_grid_features" CASCADE;
  DROP TABLE "pages_blocks_feature_grid" CASCADE;
  DROP TABLE "pages_blocks_stats_counter_stats" CASCADE;
  DROP TABLE "pages_blocks_stats_counter" CASCADE;
  DROP TABLE "pages_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "pages_blocks_faq_accordion" CASCADE;
  DROP TABLE "pages_blocks_timeline_items" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_contact_form" CASCADE;
  DROP TABLE "pages_blocks_newsletter" CASCADE;
  DROP TABLE "pages_blocks_social_proof_logos" CASCADE;
  DROP TABLE "pages_blocks_social_proof_stats" CASCADE;
  DROP TABLE "pages_blocks_social_proof_badges" CASCADE;
  DROP TABLE "pages_blocks_social_proof" CASCADE;
  DROP TABLE "pages_blocks_container" CASCADE;
  DROP TABLE "pages_blocks_divider" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages_breadcrumbs" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_actions" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_code" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid_services_features" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid_services" CASCADE;
  DROP TABLE "_pages_v_blocks_services_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_tech_stack_technologies" CASCADE;
  DROP TABLE "_pages_v_blocks_tech_stack" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_process_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_table_tiers_features" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_table_tiers" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_table" CASCADE;
  DROP TABLE "_pages_v_blocks_project_showcase_projects_technologies" CASCADE;
  DROP TABLE "_pages_v_blocks_project_showcase_projects" CASCADE;
  DROP TABLE "_pages_v_blocks_project_showcase_filter_categories" CASCADE;
  DROP TABLE "_pages_v_blocks_project_showcase" CASCADE;
  DROP TABLE "_pages_v_blocks_case_study_approach_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_case_study_solution_technologies" CASCADE;
  DROP TABLE "_pages_v_blocks_case_study_results_metrics" CASCADE;
  DROP TABLE "_pages_v_blocks_case_study" CASCADE;
  DROP TABLE "_pages_v_blocks_before_after" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid_features" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_counter_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_counter" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_items" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_form" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter" CASCADE;
  DROP TABLE "_pages_v_blocks_social_proof_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_social_proof_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_social_proof_badges" CASCADE;
  DROP TABLE "_pages_v_blocks_social_proof" CASCADE;
  DROP TABLE "_pages_v_blocks_container" CASCADE;
  DROP TABLE "_pages_v_blocks_divider" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "blogs_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "blogs_blocks_hero_actions" CASCADE;
  DROP TABLE "blogs_blocks_hero" CASCADE;
  DROP TABLE "blogs_blocks_content_columns" CASCADE;
  DROP TABLE "blogs_blocks_content" CASCADE;
  DROP TABLE "blogs_blocks_media_block" CASCADE;
  DROP TABLE "blogs_blocks_archive" CASCADE;
  DROP TABLE "blogs_blocks_banner" CASCADE;
  DROP TABLE "blogs_blocks_code" CASCADE;
  DROP TABLE "blogs_blocks_feature_grid_features" CASCADE;
  DROP TABLE "blogs_blocks_feature_grid" CASCADE;
  DROP TABLE "blogs_blocks_stats_counter_stats" CASCADE;
  DROP TABLE "blogs_blocks_stats_counter" CASCADE;
  DROP TABLE "blogs_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "blogs_blocks_faq_accordion" CASCADE;
  DROP TABLE "blogs_blocks_timeline_items" CASCADE;
  DROP TABLE "blogs_blocks_timeline" CASCADE;
  DROP TABLE "blogs_blocks_cta_links" CASCADE;
  DROP TABLE "blogs_blocks_cta" CASCADE;
  DROP TABLE "blogs_blocks_newsletter" CASCADE;
  DROP TABLE "blogs_blocks_social_proof_logos" CASCADE;
  DROP TABLE "blogs_blocks_social_proof_stats" CASCADE;
  DROP TABLE "blogs_blocks_social_proof_badges" CASCADE;
  DROP TABLE "blogs_blocks_social_proof" CASCADE;
  DROP TABLE "blogs_blocks_container" CASCADE;
  DROP TABLE "blogs_blocks_divider" CASCADE;
  DROP TABLE "blogs_blocks_spacer" CASCADE;
  DROP TABLE "blogs_tags" CASCADE;
  DROP TABLE "blogs" CASCADE;
  DROP TABLE "blogs_rels" CASCADE;
  DROP TABLE "_blogs_v_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "_blogs_v_blocks_hero_actions" CASCADE;
  DROP TABLE "_blogs_v_blocks_hero" CASCADE;
  DROP TABLE "_blogs_v_blocks_content_columns" CASCADE;
  DROP TABLE "_blogs_v_blocks_content" CASCADE;
  DROP TABLE "_blogs_v_blocks_media_block" CASCADE;
  DROP TABLE "_blogs_v_blocks_archive" CASCADE;
  DROP TABLE "_blogs_v_blocks_banner" CASCADE;
  DROP TABLE "_blogs_v_blocks_code" CASCADE;
  DROP TABLE "_blogs_v_blocks_feature_grid_features" CASCADE;
  DROP TABLE "_blogs_v_blocks_feature_grid" CASCADE;
  DROP TABLE "_blogs_v_blocks_stats_counter_stats" CASCADE;
  DROP TABLE "_blogs_v_blocks_stats_counter" CASCADE;
  DROP TABLE "_blogs_v_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "_blogs_v_blocks_faq_accordion" CASCADE;
  DROP TABLE "_blogs_v_blocks_timeline_items" CASCADE;
  DROP TABLE "_blogs_v_blocks_timeline" CASCADE;
  DROP TABLE "_blogs_v_blocks_cta_links" CASCADE;
  DROP TABLE "_blogs_v_blocks_cta" CASCADE;
  DROP TABLE "_blogs_v_blocks_newsletter" CASCADE;
  DROP TABLE "_blogs_v_blocks_social_proof_logos" CASCADE;
  DROP TABLE "_blogs_v_blocks_social_proof_stats" CASCADE;
  DROP TABLE "_blogs_v_blocks_social_proof_badges" CASCADE;
  DROP TABLE "_blogs_v_blocks_social_proof" CASCADE;
  DROP TABLE "_blogs_v_blocks_container" CASCADE;
  DROP TABLE "_blogs_v_blocks_divider" CASCADE;
  DROP TABLE "_blogs_v_blocks_spacer" CASCADE;
  DROP TABLE "_blogs_v_version_tags" CASCADE;
  DROP TABLE "_blogs_v" CASCADE;
  DROP TABLE "_blogs_v_rels" CASCADE;
  DROP TABLE "services_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "services_blocks_hero_actions" CASCADE;
  DROP TABLE "services_blocks_hero" CASCADE;
  DROP TABLE "services_blocks_content_columns" CASCADE;
  DROP TABLE "services_blocks_content" CASCADE;
  DROP TABLE "services_blocks_media_block" CASCADE;
  DROP TABLE "services_blocks_cta_links" CASCADE;
  DROP TABLE "services_blocks_cta" CASCADE;
  DROP TABLE "services_blocks_services_grid_services_features" CASCADE;
  DROP TABLE "services_blocks_services_grid_services" CASCADE;
  DROP TABLE "services_blocks_services_grid" CASCADE;
  DROP TABLE "services_blocks_tech_stack_technologies" CASCADE;
  DROP TABLE "services_blocks_tech_stack" CASCADE;
  DROP TABLE "services_blocks_process_steps_steps" CASCADE;
  DROP TABLE "services_blocks_process_steps" CASCADE;
  DROP TABLE "services_blocks_pricing_table_tiers_features" CASCADE;
  DROP TABLE "services_blocks_pricing_table_tiers" CASCADE;
  DROP TABLE "services_blocks_pricing_table" CASCADE;
  DROP TABLE "services_blocks_testimonial_testimonials" CASCADE;
  DROP TABLE "services_blocks_testimonial" CASCADE;
  DROP TABLE "services_blocks_feature_grid_features" CASCADE;
  DROP TABLE "services_blocks_feature_grid" CASCADE;
  DROP TABLE "services_blocks_stats_counter_stats" CASCADE;
  DROP TABLE "services_blocks_stats_counter" CASCADE;
  DROP TABLE "services_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "services_blocks_faq_accordion" CASCADE;
  DROP TABLE "services_blocks_contact_form" CASCADE;
  DROP TABLE "services_blocks_newsletter" CASCADE;
  DROP TABLE "services_blocks_social_proof_logos" CASCADE;
  DROP TABLE "services_blocks_social_proof_stats" CASCADE;
  DROP TABLE "services_blocks_social_proof_badges" CASCADE;
  DROP TABLE "services_blocks_social_proof" CASCADE;
  DROP TABLE "services_blocks_container" CASCADE;
  DROP TABLE "services_blocks_divider" CASCADE;
  DROP TABLE "services_blocks_spacer" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_rels" CASCADE;
  DROP TABLE "_services_v_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "_services_v_blocks_hero_actions" CASCADE;
  DROP TABLE "_services_v_blocks_hero" CASCADE;
  DROP TABLE "_services_v_blocks_content_columns" CASCADE;
  DROP TABLE "_services_v_blocks_content" CASCADE;
  DROP TABLE "_services_v_blocks_media_block" CASCADE;
  DROP TABLE "_services_v_blocks_cta_links" CASCADE;
  DROP TABLE "_services_v_blocks_cta" CASCADE;
  DROP TABLE "_services_v_blocks_services_grid_services_features" CASCADE;
  DROP TABLE "_services_v_blocks_services_grid_services" CASCADE;
  DROP TABLE "_services_v_blocks_services_grid" CASCADE;
  DROP TABLE "_services_v_blocks_tech_stack_technologies" CASCADE;
  DROP TABLE "_services_v_blocks_tech_stack" CASCADE;
  DROP TABLE "_services_v_blocks_process_steps_steps" CASCADE;
  DROP TABLE "_services_v_blocks_process_steps" CASCADE;
  DROP TABLE "_services_v_blocks_pricing_table_tiers_features" CASCADE;
  DROP TABLE "_services_v_blocks_pricing_table_tiers" CASCADE;
  DROP TABLE "_services_v_blocks_pricing_table" CASCADE;
  DROP TABLE "_services_v_blocks_testimonial_testimonials" CASCADE;
  DROP TABLE "_services_v_blocks_testimonial" CASCADE;
  DROP TABLE "_services_v_blocks_feature_grid_features" CASCADE;
  DROP TABLE "_services_v_blocks_feature_grid" CASCADE;
  DROP TABLE "_services_v_blocks_stats_counter_stats" CASCADE;
  DROP TABLE "_services_v_blocks_stats_counter" CASCADE;
  DROP TABLE "_services_v_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "_services_v_blocks_faq_accordion" CASCADE;
  DROP TABLE "_services_v_blocks_contact_form" CASCADE;
  DROP TABLE "_services_v_blocks_newsletter" CASCADE;
  DROP TABLE "_services_v_blocks_social_proof_logos" CASCADE;
  DROP TABLE "_services_v_blocks_social_proof_stats" CASCADE;
  DROP TABLE "_services_v_blocks_social_proof_badges" CASCADE;
  DROP TABLE "_services_v_blocks_social_proof" CASCADE;
  DROP TABLE "_services_v_blocks_container" CASCADE;
  DROP TABLE "_services_v_blocks_divider" CASCADE;
  DROP TABLE "_services_v_blocks_spacer" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "_services_v_rels" CASCADE;
  DROP TABLE "legal_blocks_content_columns" CASCADE;
  DROP TABLE "legal_blocks_content" CASCADE;
  DROP TABLE "legal_blocks_banner" CASCADE;
  DROP TABLE "legal_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "legal_blocks_faq_accordion" CASCADE;
  DROP TABLE "legal_blocks_container" CASCADE;
  DROP TABLE "legal_blocks_divider" CASCADE;
  DROP TABLE "legal_blocks_spacer" CASCADE;
  DROP TABLE "legal" CASCADE;
  DROP TABLE "legal_rels" CASCADE;
  DROP TABLE "_legal_v_blocks_content_columns" CASCADE;
  DROP TABLE "_legal_v_blocks_content" CASCADE;
  DROP TABLE "_legal_v_blocks_banner" CASCADE;
  DROP TABLE "_legal_v_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "_legal_v_blocks_faq_accordion" CASCADE;
  DROP TABLE "_legal_v_blocks_container" CASCADE;
  DROP TABLE "_legal_v_blocks_divider" CASCADE;
  DROP TABLE "_legal_v_blocks_spacer" CASCADE;
  DROP TABLE "_legal_v" CASCADE;
  DROP TABLE "_legal_v_rels" CASCADE;
  DROP TABLE "contacts_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "contacts_blocks_hero_actions" CASCADE;
  DROP TABLE "contacts_blocks_hero" CASCADE;
  DROP TABLE "contacts_blocks_content_columns" CASCADE;
  DROP TABLE "contacts_blocks_content" CASCADE;
  DROP TABLE "contacts_blocks_media_block" CASCADE;
  DROP TABLE "contacts_blocks_contact_form" CASCADE;
  DROP TABLE "contacts_blocks_social_proof_logos" CASCADE;
  DROP TABLE "contacts_blocks_social_proof_stats" CASCADE;
  DROP TABLE "contacts_blocks_social_proof_badges" CASCADE;
  DROP TABLE "contacts_blocks_social_proof" CASCADE;
  DROP TABLE "contacts_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "contacts_blocks_faq_accordion" CASCADE;
  DROP TABLE "contacts_blocks_container" CASCADE;
  DROP TABLE "contacts_blocks_divider" CASCADE;
  DROP TABLE "contacts_blocks_spacer" CASCADE;
  DROP TABLE "contacts_contact_info_sections" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "contacts_rels" CASCADE;
  DROP TABLE "_contacts_v_blocks_hero_gradient_config_colors" CASCADE;
  DROP TABLE "_contacts_v_blocks_hero_actions" CASCADE;
  DROP TABLE "_contacts_v_blocks_hero" CASCADE;
  DROP TABLE "_contacts_v_blocks_content_columns" CASCADE;
  DROP TABLE "_contacts_v_blocks_content" CASCADE;
  DROP TABLE "_contacts_v_blocks_media_block" CASCADE;
  DROP TABLE "_contacts_v_blocks_contact_form" CASCADE;
  DROP TABLE "_contacts_v_blocks_social_proof_logos" CASCADE;
  DROP TABLE "_contacts_v_blocks_social_proof_stats" CASCADE;
  DROP TABLE "_contacts_v_blocks_social_proof_badges" CASCADE;
  DROP TABLE "_contacts_v_blocks_social_proof" CASCADE;
  DROP TABLE "_contacts_v_blocks_faq_accordion_faqs" CASCADE;
  DROP TABLE "_contacts_v_blocks_faq_accordion" CASCADE;
  DROP TABLE "_contacts_v_blocks_container" CASCADE;
  DROP TABLE "_contacts_v_blocks_divider" CASCADE;
  DROP TABLE "_contacts_v_blocks_spacer" CASCADE;
  DROP TABLE "_contacts_v_version_contact_info_sections" CASCADE;
  DROP TABLE "_contacts_v" CASCADE;
  DROP TABLE "_contacts_v_rels" CASCADE;
  DROP TABLE "analytics_data" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_email_notifications_recipients" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_description" CASCADE;
  DROP TABLE "header_featured" CASCADE;
  DROP TABLE "header_list" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header_tabs" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_columns_nav_items" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TABLE "contact_social_media_links" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."typ";
  DROP TYPE "public"."app";
  DROP TYPE "public"."enum_pages_blocks_hero_actions_priority";
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum_pages_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum_pages_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum_pages_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum_pages_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum_pages_blocks_hero_settings_theme";
  DROP TYPE "public"."enum_pages_blocks_hero_settings_height";
  DROP TYPE "public"."enum_pages_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum_pages_blocks_content_columns_width";
  DROP TYPE "public"."enum_pages_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_pages_blocks_content_columns_padding";
  DROP TYPE "public"."enum_pages_blocks_content_gap";
  DROP TYPE "public"."enum_pages_blocks_content_alignment";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_cta_background_color";
  DROP TYPE "public"."enum_pages_blocks_cta_pattern";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_blocks_banner_style";
  DROP TYPE "public"."enum_pages_blocks_code_language";
  DROP TYPE "public"."enum_pages_blocks_code_theme";
  DROP TYPE "public"."enum_pages_blocks_services_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_services_grid_style";
  DROP TYPE "public"."enum_pages_blocks_tech_stack_technologies_category";
  DROP TYPE "public"."enum_pages_blocks_tech_stack_technologies_proficiency";
  DROP TYPE "public"."enum_pages_blocks_tech_stack_layout";
  DROP TYPE "public"."enum_pages_blocks_process_steps_layout";
  DROP TYPE "public"."enum_pages_blocks_process_steps_style";
  DROP TYPE "public"."enum_pages_blocks_pricing_table_tiers_period";
  DROP TYPE "public"."enum_pages_blocks_pricing_table_billing_period";
  DROP TYPE "public"."enum_pages_blocks_project_showcase_layout";
  DROP TYPE "public"."enum_pages_blocks_project_showcase_columns";
  DROP TYPE "public"."enum_pages_blocks_before_after_orientation";
  DROP TYPE "public"."enum_pages_blocks_testimonial_layout";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_feature_grid_style";
  DROP TYPE "public"."enum_pages_blocks_stats_counter_layout";
  DROP TYPE "public"."enum_pages_blocks_timeline_orientation";
  DROP TYPE "public"."enum_pages_blocks_timeline_style";
  DROP TYPE "public"."enum_pages_blocks_contact_form_layout";
  DROP TYPE "public"."enum_pages_blocks_newsletter_style";
  DROP TYPE "public"."enum_pages_blocks_newsletter_provider";
  DROP TYPE "public"."enum_pages_blocks_social_proof_type";
  DROP TYPE "public"."enum_pages_blocks_social_proof_layout";
  DROP TYPE "public"."enum_pages_blocks_container_max_width";
  DROP TYPE "public"."enum_pages_blocks_container_background_color";
  DROP TYPE "public"."enum_pages_blocks_container_padding_top";
  DROP TYPE "public"."enum_pages_blocks_container_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_container_margin_top";
  DROP TYPE "public"."enum_pages_blocks_container_margin_bottom";
  DROP TYPE "public"."enum_pages_blocks_divider_style";
  DROP TYPE "public"."enum_pages_blocks_divider_thickness";
  DROP TYPE "public"."enum_pages_blocks_divider_color";
  DROP TYPE "public"."enum_pages_blocks_divider_width";
  DROP TYPE "public"."enum_pages_blocks_divider_alignment";
  DROP TYPE "public"."enum_pages_blocks_divider_spacing_top";
  DROP TYPE "public"."enum_pages_blocks_divider_spacing_bottom";
  DROP TYPE "public"."enum_pages_meta_structured_type";
  DROP TYPE "public"."enum_pages_meta_social_twitter_card";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_hero_actions_priority";
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum__pages_v_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum__pages_v_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum__pages_v_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum__pages_v_blocks_hero_settings_theme";
  DROP TYPE "public"."enum__pages_v_blocks_hero_settings_height";
  DROP TYPE "public"."enum__pages_v_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_width";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_padding";
  DROP TYPE "public"."enum__pages_v_blocks_content_gap";
  DROP TYPE "public"."enum__pages_v_blocks_content_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_cta_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_cta_pattern";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_banner_style";
  DROP TYPE "public"."enum__pages_v_blocks_code_language";
  DROP TYPE "public"."enum__pages_v_blocks_code_theme";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_services_grid_style";
  DROP TYPE "public"."enum__pages_v_blocks_tech_stack_technologies_category";
  DROP TYPE "public"."enum__pages_v_blocks_tech_stack_technologies_proficiency";
  DROP TYPE "public"."enum__pages_v_blocks_tech_stack_layout";
  DROP TYPE "public"."enum__pages_v_blocks_process_steps_layout";
  DROP TYPE "public"."enum__pages_v_blocks_process_steps_style";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_table_tiers_period";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_table_billing_period";
  DROP TYPE "public"."enum__pages_v_blocks_project_showcase_layout";
  DROP TYPE "public"."enum__pages_v_blocks_project_showcase_columns";
  DROP TYPE "public"."enum__pages_v_blocks_before_after_orientation";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_layout";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_feature_grid_style";
  DROP TYPE "public"."enum__pages_v_blocks_stats_counter_layout";
  DROP TYPE "public"."enum__pages_v_blocks_timeline_orientation";
  DROP TYPE "public"."enum__pages_v_blocks_timeline_style";
  DROP TYPE "public"."enum__pages_v_blocks_contact_form_layout";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_style";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_provider";
  DROP TYPE "public"."enum__pages_v_blocks_social_proof_type";
  DROP TYPE "public"."enum__pages_v_blocks_social_proof_layout";
  DROP TYPE "public"."enum__pages_v_blocks_container_max_width";
  DROP TYPE "public"."enum__pages_v_blocks_container_background_color";
  DROP TYPE "public"."enum__pages_v_blocks_container_padding_top";
  DROP TYPE "public"."enum__pages_v_blocks_container_padding_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_container_margin_top";
  DROP TYPE "public"."enum__pages_v_blocks_container_margin_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_divider_style";
  DROP TYPE "public"."enum__pages_v_blocks_divider_thickness";
  DROP TYPE "public"."enum__pages_v_blocks_divider_color";
  DROP TYPE "public"."enum__pages_v_blocks_divider_width";
  DROP TYPE "public"."enum__pages_v_blocks_divider_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_divider_spacing_top";
  DROP TYPE "public"."enum__pages_v_blocks_divider_spacing_bottom";
  DROP TYPE "public"."enum__pages_v_version_meta_structured_type";
  DROP TYPE "public"."enum__pages_v_version_meta_social_twitter_card";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_blogs_blocks_hero_actions_priority";
  DROP TYPE "public"."enum_blogs_blocks_hero_variant";
  DROP TYPE "public"."enum_blogs_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum_blogs_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum_blogs_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum_blogs_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum_blogs_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum_blogs_blocks_hero_settings_theme";
  DROP TYPE "public"."enum_blogs_blocks_hero_settings_height";
  DROP TYPE "public"."enum_blogs_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum_blogs_blocks_content_columns_width";
  DROP TYPE "public"."enum_blogs_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_blogs_blocks_content_columns_padding";
  DROP TYPE "public"."enum_blogs_blocks_content_gap";
  DROP TYPE "public"."enum_blogs_blocks_content_alignment";
  DROP TYPE "public"."enum_blogs_blocks_archive_populate_by";
  DROP TYPE "public"."enum_blogs_blocks_archive_relation_to";
  DROP TYPE "public"."enum_blogs_blocks_banner_style";
  DROP TYPE "public"."enum_blogs_blocks_code_language";
  DROP TYPE "public"."enum_blogs_blocks_code_theme";
  DROP TYPE "public"."enum_blogs_blocks_feature_grid_columns";
  DROP TYPE "public"."enum_blogs_blocks_feature_grid_style";
  DROP TYPE "public"."enum_blogs_blocks_stats_counter_layout";
  DROP TYPE "public"."enum_blogs_blocks_timeline_orientation";
  DROP TYPE "public"."enum_blogs_blocks_timeline_style";
  DROP TYPE "public"."enum_blogs_blocks_cta_variant";
  DROP TYPE "public"."enum_blogs_blocks_cta_background_color";
  DROP TYPE "public"."enum_blogs_blocks_cta_pattern";
  DROP TYPE "public"."enum_blogs_blocks_newsletter_style";
  DROP TYPE "public"."enum_blogs_blocks_newsletter_provider";
  DROP TYPE "public"."enum_blogs_blocks_social_proof_type";
  DROP TYPE "public"."enum_blogs_blocks_social_proof_layout";
  DROP TYPE "public"."enum_blogs_blocks_container_max_width";
  DROP TYPE "public"."enum_blogs_blocks_container_background_color";
  DROP TYPE "public"."enum_blogs_blocks_container_padding_top";
  DROP TYPE "public"."enum_blogs_blocks_container_padding_bottom";
  DROP TYPE "public"."enum_blogs_blocks_container_margin_top";
  DROP TYPE "public"."enum_blogs_blocks_container_margin_bottom";
  DROP TYPE "public"."enum_blogs_blocks_divider_style";
  DROP TYPE "public"."enum_blogs_blocks_divider_thickness";
  DROP TYPE "public"."enum_blogs_blocks_divider_color";
  DROP TYPE "public"."enum_blogs_blocks_divider_width";
  DROP TYPE "public"."enum_blogs_blocks_divider_alignment";
  DROP TYPE "public"."enum_blogs_blocks_divider_spacing_top";
  DROP TYPE "public"."enum_blogs_blocks_divider_spacing_bottom";
  DROP TYPE "public"."enum_blogs_meta_structured_type";
  DROP TYPE "public"."enum_blogs_meta_social_twitter_card";
  DROP TYPE "public"."enum_blogs_status";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_actions_priority";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_variant";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_settings_theme";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_settings_height";
  DROP TYPE "public"."enum__blogs_v_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum__blogs_v_blocks_content_columns_width";
  DROP TYPE "public"."enum__blogs_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__blogs_v_blocks_content_columns_padding";
  DROP TYPE "public"."enum__blogs_v_blocks_content_gap";
  DROP TYPE "public"."enum__blogs_v_blocks_content_alignment";
  DROP TYPE "public"."enum__blogs_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__blogs_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__blogs_v_blocks_banner_style";
  DROP TYPE "public"."enum__blogs_v_blocks_code_language";
  DROP TYPE "public"."enum__blogs_v_blocks_code_theme";
  DROP TYPE "public"."enum__blogs_v_blocks_feature_grid_columns";
  DROP TYPE "public"."enum__blogs_v_blocks_feature_grid_style";
  DROP TYPE "public"."enum__blogs_v_blocks_stats_counter_layout";
  DROP TYPE "public"."enum__blogs_v_blocks_timeline_orientation";
  DROP TYPE "public"."enum__blogs_v_blocks_timeline_style";
  DROP TYPE "public"."enum__blogs_v_blocks_cta_variant";
  DROP TYPE "public"."enum__blogs_v_blocks_cta_background_color";
  DROP TYPE "public"."enum__blogs_v_blocks_cta_pattern";
  DROP TYPE "public"."enum__blogs_v_blocks_newsletter_style";
  DROP TYPE "public"."enum__blogs_v_blocks_newsletter_provider";
  DROP TYPE "public"."enum__blogs_v_blocks_social_proof_type";
  DROP TYPE "public"."enum__blogs_v_blocks_social_proof_layout";
  DROP TYPE "public"."enum__blogs_v_blocks_container_max_width";
  DROP TYPE "public"."enum__blogs_v_blocks_container_background_color";
  DROP TYPE "public"."enum__blogs_v_blocks_container_padding_top";
  DROP TYPE "public"."enum__blogs_v_blocks_container_padding_bottom";
  DROP TYPE "public"."enum__blogs_v_blocks_container_margin_top";
  DROP TYPE "public"."enum__blogs_v_blocks_container_margin_bottom";
  DROP TYPE "public"."enum__blogs_v_blocks_divider_style";
  DROP TYPE "public"."enum__blogs_v_blocks_divider_thickness";
  DROP TYPE "public"."enum__blogs_v_blocks_divider_color";
  DROP TYPE "public"."enum__blogs_v_blocks_divider_width";
  DROP TYPE "public"."enum__blogs_v_blocks_divider_alignment";
  DROP TYPE "public"."enum__blogs_v_blocks_divider_spacing_top";
  DROP TYPE "public"."enum__blogs_v_blocks_divider_spacing_bottom";
  DROP TYPE "public"."enum__blogs_v_version_meta_structured_type";
  DROP TYPE "public"."enum__blogs_v_version_meta_social_twitter_card";
  DROP TYPE "public"."enum__blogs_v_version_status";
  DROP TYPE "public"."enum_services_blocks_hero_actions_priority";
  DROP TYPE "public"."enum_services_blocks_hero_variant";
  DROP TYPE "public"."enum_services_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum_services_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum_services_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum_services_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum_services_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum_services_blocks_hero_settings_theme";
  DROP TYPE "public"."enum_services_blocks_hero_settings_height";
  DROP TYPE "public"."enum_services_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum_services_blocks_content_columns_width";
  DROP TYPE "public"."enum_services_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_services_blocks_content_columns_padding";
  DROP TYPE "public"."enum_services_blocks_content_gap";
  DROP TYPE "public"."enum_services_blocks_content_alignment";
  DROP TYPE "public"."enum_services_blocks_cta_variant";
  DROP TYPE "public"."enum_services_blocks_cta_background_color";
  DROP TYPE "public"."enum_services_blocks_cta_pattern";
  DROP TYPE "public"."enum_services_blocks_services_grid_columns";
  DROP TYPE "public"."enum_services_blocks_services_grid_style";
  DROP TYPE "public"."enum_services_blocks_tech_stack_technologies_category";
  DROP TYPE "public"."enum_services_blocks_tech_stack_technologies_proficiency";
  DROP TYPE "public"."enum_services_blocks_tech_stack_layout";
  DROP TYPE "public"."enum_services_blocks_process_steps_layout";
  DROP TYPE "public"."enum_services_blocks_process_steps_style";
  DROP TYPE "public"."enum_services_blocks_pricing_table_tiers_period";
  DROP TYPE "public"."enum_services_blocks_pricing_table_billing_period";
  DROP TYPE "public"."enum_services_blocks_testimonial_layout";
  DROP TYPE "public"."enum_services_blocks_feature_grid_columns";
  DROP TYPE "public"."enum_services_blocks_feature_grid_style";
  DROP TYPE "public"."enum_services_blocks_stats_counter_layout";
  DROP TYPE "public"."enum_services_blocks_contact_form_layout";
  DROP TYPE "public"."enum_services_blocks_newsletter_style";
  DROP TYPE "public"."enum_services_blocks_newsletter_provider";
  DROP TYPE "public"."enum_services_blocks_social_proof_type";
  DROP TYPE "public"."enum_services_blocks_social_proof_layout";
  DROP TYPE "public"."enum_services_blocks_container_max_width";
  DROP TYPE "public"."enum_services_blocks_container_background_color";
  DROP TYPE "public"."enum_services_blocks_container_padding_top";
  DROP TYPE "public"."enum_services_blocks_container_padding_bottom";
  DROP TYPE "public"."enum_services_blocks_container_margin_top";
  DROP TYPE "public"."enum_services_blocks_container_margin_bottom";
  DROP TYPE "public"."enum_services_blocks_divider_style";
  DROP TYPE "public"."enum_services_blocks_divider_thickness";
  DROP TYPE "public"."enum_services_blocks_divider_color";
  DROP TYPE "public"."enum_services_blocks_divider_width";
  DROP TYPE "public"."enum_services_blocks_divider_alignment";
  DROP TYPE "public"."enum_services_blocks_divider_spacing_top";
  DROP TYPE "public"."enum_services_blocks_divider_spacing_bottom";
  DROP TYPE "public"."enum_services_meta_structured_type";
  DROP TYPE "public"."enum_services_meta_social_twitter_card";
  DROP TYPE "public"."enum_services_service_type";
  DROP TYPE "public"."enum_services_pricing_currency";
  DROP TYPE "public"."enum_services_pricing_pricing_model";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_blocks_hero_actions_priority";
  DROP TYPE "public"."enum__services_v_blocks_hero_variant";
  DROP TYPE "public"."enum__services_v_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum__services_v_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum__services_v_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum__services_v_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum__services_v_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum__services_v_blocks_hero_settings_theme";
  DROP TYPE "public"."enum__services_v_blocks_hero_settings_height";
  DROP TYPE "public"."enum__services_v_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum__services_v_blocks_content_columns_width";
  DROP TYPE "public"."enum__services_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__services_v_blocks_content_columns_padding";
  DROP TYPE "public"."enum__services_v_blocks_content_gap";
  DROP TYPE "public"."enum__services_v_blocks_content_alignment";
  DROP TYPE "public"."enum__services_v_blocks_cta_variant";
  DROP TYPE "public"."enum__services_v_blocks_cta_background_color";
  DROP TYPE "public"."enum__services_v_blocks_cta_pattern";
  DROP TYPE "public"."enum__services_v_blocks_services_grid_columns";
  DROP TYPE "public"."enum__services_v_blocks_services_grid_style";
  DROP TYPE "public"."enum__services_v_blocks_tech_stack_technologies_category";
  DROP TYPE "public"."enum__services_v_blocks_tech_stack_technologies_proficiency";
  DROP TYPE "public"."enum__services_v_blocks_tech_stack_layout";
  DROP TYPE "public"."enum__services_v_blocks_process_steps_layout";
  DROP TYPE "public"."enum__services_v_blocks_process_steps_style";
  DROP TYPE "public"."enum__services_v_blocks_pricing_table_tiers_period";
  DROP TYPE "public"."enum__services_v_blocks_pricing_table_billing_period";
  DROP TYPE "public"."enum__services_v_blocks_testimonial_layout";
  DROP TYPE "public"."enum__services_v_blocks_feature_grid_columns";
  DROP TYPE "public"."enum__services_v_blocks_feature_grid_style";
  DROP TYPE "public"."enum__services_v_blocks_stats_counter_layout";
  DROP TYPE "public"."enum__services_v_blocks_contact_form_layout";
  DROP TYPE "public"."enum__services_v_blocks_newsletter_style";
  DROP TYPE "public"."enum__services_v_blocks_newsletter_provider";
  DROP TYPE "public"."enum__services_v_blocks_social_proof_type";
  DROP TYPE "public"."enum__services_v_blocks_social_proof_layout";
  DROP TYPE "public"."enum__services_v_blocks_container_max_width";
  DROP TYPE "public"."enum__services_v_blocks_container_background_color";
  DROP TYPE "public"."enum__services_v_blocks_container_padding_top";
  DROP TYPE "public"."enum__services_v_blocks_container_padding_bottom";
  DROP TYPE "public"."enum__services_v_blocks_container_margin_top";
  DROP TYPE "public"."enum__services_v_blocks_container_margin_bottom";
  DROP TYPE "public"."enum__services_v_blocks_divider_style";
  DROP TYPE "public"."enum__services_v_blocks_divider_thickness";
  DROP TYPE "public"."enum__services_v_blocks_divider_color";
  DROP TYPE "public"."enum__services_v_blocks_divider_width";
  DROP TYPE "public"."enum__services_v_blocks_divider_alignment";
  DROP TYPE "public"."enum__services_v_blocks_divider_spacing_top";
  DROP TYPE "public"."enum__services_v_blocks_divider_spacing_bottom";
  DROP TYPE "public"."enum__services_v_version_meta_structured_type";
  DROP TYPE "public"."enum__services_v_version_meta_social_twitter_card";
  DROP TYPE "public"."enum__services_v_version_service_type";
  DROP TYPE "public"."enum__services_v_version_pricing_currency";
  DROP TYPE "public"."enum__services_v_version_pricing_pricing_model";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_legal_blocks_content_columns_width";
  DROP TYPE "public"."enum_legal_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_legal_blocks_content_columns_padding";
  DROP TYPE "public"."enum_legal_blocks_content_gap";
  DROP TYPE "public"."enum_legal_blocks_content_alignment";
  DROP TYPE "public"."enum_legal_blocks_banner_style";
  DROP TYPE "public"."enum_legal_blocks_container_max_width";
  DROP TYPE "public"."enum_legal_blocks_container_background_color";
  DROP TYPE "public"."enum_legal_blocks_container_padding_top";
  DROP TYPE "public"."enum_legal_blocks_container_padding_bottom";
  DROP TYPE "public"."enum_legal_blocks_container_margin_top";
  DROP TYPE "public"."enum_legal_blocks_container_margin_bottom";
  DROP TYPE "public"."enum_legal_blocks_divider_style";
  DROP TYPE "public"."enum_legal_blocks_divider_thickness";
  DROP TYPE "public"."enum_legal_blocks_divider_color";
  DROP TYPE "public"."enum_legal_blocks_divider_width";
  DROP TYPE "public"."enum_legal_blocks_divider_alignment";
  DROP TYPE "public"."enum_legal_blocks_divider_spacing_top";
  DROP TYPE "public"."enum_legal_blocks_divider_spacing_bottom";
  DROP TYPE "public"."enum_legal_meta_structured_type";
  DROP TYPE "public"."enum_legal_meta_social_twitter_card";
  DROP TYPE "public"."enum_legal_document_type";
  DROP TYPE "public"."enum_legal_status";
  DROP TYPE "public"."enum__legal_v_blocks_content_columns_width";
  DROP TYPE "public"."enum__legal_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__legal_v_blocks_content_columns_padding";
  DROP TYPE "public"."enum__legal_v_blocks_content_gap";
  DROP TYPE "public"."enum__legal_v_blocks_content_alignment";
  DROP TYPE "public"."enum__legal_v_blocks_banner_style";
  DROP TYPE "public"."enum__legal_v_blocks_container_max_width";
  DROP TYPE "public"."enum__legal_v_blocks_container_background_color";
  DROP TYPE "public"."enum__legal_v_blocks_container_padding_top";
  DROP TYPE "public"."enum__legal_v_blocks_container_padding_bottom";
  DROP TYPE "public"."enum__legal_v_blocks_container_margin_top";
  DROP TYPE "public"."enum__legal_v_blocks_container_margin_bottom";
  DROP TYPE "public"."enum__legal_v_blocks_divider_style";
  DROP TYPE "public"."enum__legal_v_blocks_divider_thickness";
  DROP TYPE "public"."enum__legal_v_blocks_divider_color";
  DROP TYPE "public"."enum__legal_v_blocks_divider_width";
  DROP TYPE "public"."enum__legal_v_blocks_divider_alignment";
  DROP TYPE "public"."enum__legal_v_blocks_divider_spacing_top";
  DROP TYPE "public"."enum__legal_v_blocks_divider_spacing_bottom";
  DROP TYPE "public"."enum__legal_v_version_meta_structured_type";
  DROP TYPE "public"."enum__legal_v_version_meta_social_twitter_card";
  DROP TYPE "public"."enum__legal_v_version_document_type";
  DROP TYPE "public"."enum__legal_v_version_status";
  DROP TYPE "public"."enum_contacts_blocks_hero_actions_priority";
  DROP TYPE "public"."enum_contacts_blocks_hero_variant";
  DROP TYPE "public"."enum_contacts_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum_contacts_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum_contacts_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum_contacts_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum_contacts_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum_contacts_blocks_hero_settings_theme";
  DROP TYPE "public"."enum_contacts_blocks_hero_settings_height";
  DROP TYPE "public"."enum_contacts_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum_contacts_blocks_content_columns_width";
  DROP TYPE "public"."enum_contacts_blocks_content_columns_background_color";
  DROP TYPE "public"."enum_contacts_blocks_content_columns_padding";
  DROP TYPE "public"."enum_contacts_blocks_content_gap";
  DROP TYPE "public"."enum_contacts_blocks_content_alignment";
  DROP TYPE "public"."enum_contacts_blocks_contact_form_layout";
  DROP TYPE "public"."enum_contacts_blocks_social_proof_type";
  DROP TYPE "public"."enum_contacts_blocks_social_proof_layout";
  DROP TYPE "public"."enum_contacts_blocks_container_max_width";
  DROP TYPE "public"."enum_contacts_blocks_container_background_color";
  DROP TYPE "public"."enum_contacts_blocks_container_padding_top";
  DROP TYPE "public"."enum_contacts_blocks_container_padding_bottom";
  DROP TYPE "public"."enum_contacts_blocks_container_margin_top";
  DROP TYPE "public"."enum_contacts_blocks_container_margin_bottom";
  DROP TYPE "public"."enum_contacts_blocks_divider_style";
  DROP TYPE "public"."enum_contacts_blocks_divider_thickness";
  DROP TYPE "public"."enum_contacts_blocks_divider_color";
  DROP TYPE "public"."enum_contacts_blocks_divider_width";
  DROP TYPE "public"."enum_contacts_blocks_divider_alignment";
  DROP TYPE "public"."enum_contacts_blocks_divider_spacing_top";
  DROP TYPE "public"."enum_contacts_blocks_divider_spacing_bottom";
  DROP TYPE "public"."enum_contacts_contact_info_sections";
  DROP TYPE "public"."enum_contacts_purpose";
  DROP TYPE "public"."enum_contacts_meta_structured_type";
  DROP TYPE "public"."enum_contacts_meta_social_twitter_card";
  DROP TYPE "public"."enum_contacts_status";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_actions_priority";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_variant";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_code_snippet_language";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_code_snippet_theme";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_split_layout_content_side";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_split_layout_media_type";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_gradient_config_animation";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_settings_theme";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_settings_height";
  DROP TYPE "public"."enum__contacts_v_blocks_hero_settings_overlay_color";
  DROP TYPE "public"."enum__contacts_v_blocks_content_columns_width";
  DROP TYPE "public"."enum__contacts_v_blocks_content_columns_background_color";
  DROP TYPE "public"."enum__contacts_v_blocks_content_columns_padding";
  DROP TYPE "public"."enum__contacts_v_blocks_content_gap";
  DROP TYPE "public"."enum__contacts_v_blocks_content_alignment";
  DROP TYPE "public"."enum__contacts_v_blocks_contact_form_layout";
  DROP TYPE "public"."enum__contacts_v_blocks_social_proof_type";
  DROP TYPE "public"."enum__contacts_v_blocks_social_proof_layout";
  DROP TYPE "public"."enum__contacts_v_blocks_container_max_width";
  DROP TYPE "public"."enum__contacts_v_blocks_container_background_color";
  DROP TYPE "public"."enum__contacts_v_blocks_container_padding_top";
  DROP TYPE "public"."enum__contacts_v_blocks_container_padding_bottom";
  DROP TYPE "public"."enum__contacts_v_blocks_container_margin_top";
  DROP TYPE "public"."enum__contacts_v_blocks_container_margin_bottom";
  DROP TYPE "public"."enum__contacts_v_blocks_divider_style";
  DROP TYPE "public"."enum__contacts_v_blocks_divider_thickness";
  DROP TYPE "public"."enum__contacts_v_blocks_divider_color";
  DROP TYPE "public"."enum__contacts_v_blocks_divider_width";
  DROP TYPE "public"."enum__contacts_v_blocks_divider_alignment";
  DROP TYPE "public"."enum__contacts_v_blocks_divider_spacing_top";
  DROP TYPE "public"."enum__contacts_v_blocks_divider_spacing_bottom";
  DROP TYPE "public"."enum__contacts_v_version_contact_info_sections";
  DROP TYPE "public"."enum__contacts_v_version_purpose";
  DROP TYPE "public"."enum__contacts_v_version_meta_structured_type";
  DROP TYPE "public"."enum__contacts_v_version_meta_social_twitter_card";
  DROP TYPE "public"."enum__contacts_v_version_status";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_header_nav_items_style";
  DROP TYPE "public"."enum_header_meta_structured_type";
  DROP TYPE "public"."enum_header_meta_social_twitter_card";
  DROP TYPE "public"."enum_footer_meta_structured_type";
  DROP TYPE "public"."enum_footer_meta_social_twitter_card";
  DROP TYPE "public"."enum_contact_social_media_links_platform";`)
}
