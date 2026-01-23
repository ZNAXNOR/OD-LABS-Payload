import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Database Identifier Optimization
 * Generated: 2026-01-22T14:00:00.000Z
 *
 * This migration handles database identifier renaming to comply with PostgreSQL
 * 63-character identifier length limits while preserving data integrity.
 *
 * The migration renames long enum and table identifiers to shorter, semantically
 * meaningful names that stay within PostgreSQL's limits.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Rename enum types for Hero blocks
    ALTER TYPE "public"."enum_pages_blocks_hero_code_snippet_language" RENAME TO "enum_pages_hero_code_lang";
    ALTER TYPE "public"."enum_pages_blocks_hero_code_snippet_theme" RENAME TO "enum_pages_hero_code_theme";
    ALTER TYPE "public"."enum_pages_blocks_hero_split_layout_content_side" RENAME TO "enum_pages_hero_split_side";
    ALTER TYPE "public"."enum_pages_blocks_hero_split_layout_media_type" RENAME TO "enum_pages_hero_split_media";
    ALTER TYPE "public"."enum_pages_blocks_hero_gradient_config_animation" RENAME TO "enum_pages_hero_grad_anim";
    ALTER TYPE "public"."enum_pages_blocks_hero_settings_overlay_color" RENAME TO "enum_pages_hero_overlay_color";

    -- Rename enum types for Content blocks
    ALTER TYPE "public"."enum_pages_blocks_content_columns_background_color" RENAME TO "enum_pages_content_col_bg";
    ALTER TYPE "public"."enum_pages_blocks_content_columns_padding" RENAME TO "enum_pages_content_col_pad";

    -- Rename enum types for Tech Stack blocks
    ALTER TYPE "public"."enum_pages_blocks_tech_stack_technologies_category" RENAME TO "enum_pages_tech_cat";
    ALTER TYPE "public"."enum_pages_blocks_tech_stack_technologies_proficiency" RENAME TO "enum_pages_tech_prof";

    -- Rename enum types for Pricing Table blocks
    ALTER TYPE "public"."enum_pages_blocks_pricing_table_tiers_period" RENAME TO "enum_pages_price_period";
    ALTER TYPE "public"."enum_pages_blocks_pricing_table_billing_period" RENAME TO "enum_pages_price_billing";

    -- Rename enum types for Project Showcase blocks
    ALTER TYPE "public"."enum_pages_blocks_project_showcase_layout" RENAME TO "enum_pages_proj_layout";
    ALTER TYPE "public"."enum_pages_blocks_project_showcase_columns" RENAME TO "enum_pages_proj_cols";

    -- Rename enum types for Before/After blocks
    ALTER TYPE "public"."enum_pages_blocks_before_after_orientation" RENAME TO "enum_pages_before_after_orient";

    -- Rename enum types for Feature Grid blocks
    ALTER TYPE "public"."enum_pages_blocks_feature_grid_columns" RENAME TO "enum_pages_feat_grid_cols";
    ALTER TYPE "public"."enum_pages_blocks_feature_grid_style" RENAME TO "enum_pages_feat_grid_style";

    -- Rename enum types for Stats Counter blocks
    ALTER TYPE "public"."enum_pages_blocks_stats_counter_layout" RENAME TO "enum_pages_stats_layout";

    -- Rename enum types for Timeline blocks
    ALTER TYPE "public"."enum_pages_blocks_timeline_orientation" RENAME TO "enum_pages_timeline_orient";

    -- Rename enum types for Contact Form blocks
    ALTER TYPE "public"."enum_pages_blocks_contact_form_layout" RENAME TO "enum_pages_contact_layout";

    -- Rename enum types for Newsletter blocks
    ALTER TYPE "public"."enum_pages_blocks_newsletter_provider" RENAME TO "enum_pages_newsletter_provider";

    -- Rename enum types for Social Proof blocks
    ALTER TYPE "public"."enum_pages_blocks_social_proof_type" RENAME TO "enum_pages_social_type";
    ALTER TYPE "public"."enum_pages_blocks_social_proof_layout" RENAME TO "enum_pages_social_layout";

    -- Rename enum types for Container blocks
    ALTER TYPE "public"."enum_pages_blocks_container_max_width" RENAME TO "enum_pages_container_width";
    ALTER TYPE "public"."enum_pages_blocks_container_background_color" RENAME TO "enum_pages_container_bg";
    ALTER TYPE "public"."enum_pages_blocks_container_padding_top" RENAME TO "enum_pages_container_pad_top";
    ALTER TYPE "public"."enum_pages_blocks_container_padding_bottom" RENAME TO "enum_pages_container_pad_bot";
    ALTER TYPE "public"."enum_pages_blocks_container_margin_top" RENAME TO "enum_pages_container_mar_top";
    ALTER TYPE "public"."enum_pages_blocks_container_margin_bottom" RENAME TO "enum_pages_container_mar_bot";

    -- Rename enum types for Divider blocks
    ALTER TYPE "public"."enum_pages_blocks_divider_spacing_top" RENAME TO "enum_pages_divider_space_top";
    ALTER TYPE "public"."enum_pages_blocks_divider_spacing_bottom" RENAME TO "enum_pages_divider_space_bot";

    -- Rename enum types for Meta fields
    ALTER TYPE "public"."enum_pages_meta_structured_type" RENAME TO "enum_pages_meta_struct_type";
    ALTER TYPE "public"."enum_pages_meta_social_twitter_card" RENAME TO "enum_pages_meta_twitter_card";

    -- Rename version enum types (similar patterns for _pages_v)
    ALTER TYPE "public"."enum__pages_v_blocks_hero_code_snippet_language" RENAME TO "enum_pages_v_hero_code_lang";
    ALTER TYPE "public"."enum__pages_v_blocks_hero_code_snippet_theme" RENAME TO "enum_pages_v_hero_code_theme";
    ALTER TYPE "public"."enum__pages_v_blocks_hero_split_layout_content_side" RENAME TO "enum_pages_v_hero_split_side";
    ALTER TYPE "public"."enum__pages_v_blocks_hero_split_layout_media_type" RENAME TO "enum_pages_v_hero_split_media";
    ALTER TYPE "public"."enum__pages_v_blocks_hero_gradient_config_animation" RENAME TO "enum_pages_v_hero_grad_anim";
    ALTER TYPE "public"."enum__pages_v_blocks_hero_settings_overlay_color" RENAME TO "enum_pages_v_hero_overlay_color";
    ALTER TYPE "public"."enum__pages_v_blocks_content_columns_background_color" RENAME TO "enum_pages_v_content_col_bg";
    ALTER TYPE "public"."enum__pages_v_blocks_content_columns_padding" RENAME TO "enum_pages_v_content_col_pad";
    ALTER TYPE "public"."enum__pages_v_blocks_tech_stack_technologies_category" RENAME TO "enum_pages_v_tech_cat";
    ALTER TYPE "public"."enum__pages_v_blocks_tech_stack_technologies_proficiency" RENAME TO "enum_pages_v_tech_prof";
    ALTER TYPE "public"."enum__pages_v_blocks_pricing_table_tiers_period" RENAME TO "enum_pages_v_price_period";
    ALTER TYPE "public"."enum__pages_v_blocks_pricing_table_billing_period" RENAME TO "enum_pages_v_price_billing";
    ALTER TYPE "public"."enum__pages_v_blocks_project_showcase_layout" RENAME TO "enum_pages_v_proj_layout";
    ALTER TYPE "public"."enum__pages_v_blocks_project_showcase_columns" RENAME TO "enum_pages_v_proj_cols";
    ALTER TYPE "public"."enum__pages_v_blocks_before_after_orientation" RENAME TO "enum_pages_v_before_after_orient";
    ALTER TYPE "public"."enum__pages_v_blocks_feature_grid_columns" RENAME TO "enum_pages_v_feat_grid_cols";
    ALTER TYPE "public"."enum__pages_v_blocks_feature_grid_style" RENAME TO "enum_pages_v_feat_grid_style";
    ALTER TYPE "public"."enum__pages_v_blocks_stats_counter_layout" RENAME TO "enum_pages_v_stats_layout";
    ALTER TYPE "public"."enum__pages_v_blocks_timeline_orientation" RENAME TO "enum_pages_v_timeline_orient";
    ALTER TYPE "public"."enum__pages_v_blocks_contact_form_layout" RENAME TO "enum_pages_v_contact_layout";
    ALTER TYPE "public"."enum__pages_v_blocks_newsletter_provider" RENAME TO "enum_pages_v_newsletter_provider";
    ALTER TYPE "public"."enum__pages_v_blocks_social_proof_type" RENAME TO "enum_pages_v_social_type";
    ALTER TYPE "public"."enum__pages_v_blocks_social_proof_layout" RENAME TO "enum_pages_v_social_layout";
    ALTER TYPE "public"."enum__pages_v_blocks_container_max_width" RENAME TO "enum_pages_v_container_width";
    ALTER TYPE "public"."enum__pages_v_blocks_container_background_color" RENAME TO "enum_pages_v_container_bg";
    ALTER TYPE "public"."enum__pages_v_blocks_container_padding_top" RENAME TO "enum_pages_v_container_pad_top";
    ALTER TYPE "public"."enum__pages_v_blocks_container_padding_bottom" RENAME TO "enum_pages_v_container_pad_bot";
    ALTER TYPE "public"."enum__pages_v_blocks_container_margin_top" RENAME TO "enum_pages_v_container_mar_top";
    ALTER TYPE "public"."enum__pages_v_blocks_container_margin_bottom" RENAME TO "enum_pages_v_container_mar_bot";
    ALTER TYPE "public"."enum__pages_v_blocks_divider_spacing_top" RENAME TO "enum_pages_v_divider_space_top";
    ALTER TYPE "public"."enum__pages_v_blocks_divider_spacing_bottom" RENAME TO "enum_pages_v_divider_space_bot";
    ALTER TYPE "public"."enum__pages_v_version_meta_structured_type" RENAME TO "enum_pages_v_meta_struct_type";
    ALTER TYPE "public"."enum__pages_v_version_meta_social_twitter_card" RENAME TO "enum_pages_v_meta_twitter_card";

    -- Rename blog enum types (similar patterns for blogs)
    ALTER TYPE "public"."enum_blogs_blocks_hero_code_snippet_language" RENAME TO "enum_blogs_hero_code_lang";
    ALTER TYPE "public"."enum_blogs_blocks_hero_code_snippet_theme" RENAME TO "enum_blogs_hero_code_theme";
    ALTER TYPE "public"."enum_blogs_blocks_hero_split_layout_content_side" RENAME TO "enum_blogs_hero_split_side";
    ALTER TYPE "public"."enum_blogs_blocks_hero_split_layout_media_type" RENAME TO "enum_blogs_hero_split_media";
    ALTER TYPE "public"."enum_blogs_blocks_hero_gradient_config_animation" RENAME TO "enum_blogs_hero_grad_anim";
    ALTER TYPE "public"."enum_blogs_blocks_hero_settings_overlay_color" RENAME TO "enum_blogs_hero_overlay_color";
    ALTER TYPE "public"."enum_blogs_blocks_content_columns_background_color" RENAME TO "enum_blogs_content_col_bg";
    ALTER TYPE "public"."enum_blogs_blocks_content_columns_padding" RENAME TO "enum_blogs_content_col_pad";
    ALTER TYPE "public"."enum_blogs_blocks_feature_grid_columns" RENAME TO "enum_blogs_feat_grid_cols";
    ALTER TYPE "public"."enum_blogs_blocks_feature_grid_style" RENAME TO "enum_blogs_feat_grid_style";
    ALTER TYPE "public"."enum_blogs_blocks_stats_counter_layout" RENAME TO "enum_blogs_stats_layout";
    ALTER TYPE "public"."enum_blogs_blocks_timeline_orientation" RENAME TO "enum_blogs_timeline_orient";
    ALTER TYPE "public"."enum_blogs_blocks_newsletter_provider" RENAME TO "enum_blogs_newsletter_provider";
    ALTER TYPE "public"."enum_blogs_blocks_social_proof_type" RENAME TO "enum_blogs_social_type";
    ALTER TYPE "public"."enum_blogs_blocks_social_proof_layout" RENAME TO "enum_blogs_social_layout";
    ALTER TYPE "public"."enum_blogs_blocks_container_max_width" RENAME TO "enum_blogs_container_width";
    ALTER TYPE "public"."enum_blogs_blocks_container_background_color" RENAME TO "enum_blogs_container_bg";
    ALTER TYPE "public"."enum_blogs_blocks_container_padding_top" RENAME TO "enum_blogs_container_pad_top";
    ALTER TYPE "public"."enum_blogs_blocks_container_padding_bottom" RENAME TO "enum_blogs_container_pad_bot";
    ALTER TYPE "public"."enum_blogs_blocks_container_margin_top" RENAME TO "enum_blogs_container_mar_top";
    ALTER TYPE "public"."enum_blogs_blocks_container_margin_bottom" RENAME TO "enum_blogs_container_mar_bot";
    ALTER TYPE "public"."enum_blogs_blocks_divider_spacing_top" RENAME TO "enum_blogs_divider_space_top";
    ALTER TYPE "public"."enum_blogs_blocks_divider_spacing_bottom" RENAME TO "enum_blogs_divider_space_bot";
    ALTER TYPE "public"."enum_blogs_meta_structured_type" RENAME TO "enum_blogs_meta_struct_type";
    ALTER TYPE "public"."enum_blogs_meta_social_twitter_card" RENAME TO "enum_blogs_meta_twitter_card";

    -- Rename blog version enum types
    ALTER TYPE "public"."enum__blogs_v_blocks_hero_code_snippet_language" RENAME TO "enum_blogs_v_hero_code_lang";
    ALTER TYPE "public"."enum__blogs_v_blocks_hero_code_snippet_theme" RENAME TO "enum_blogs_v_hero_code_theme";
    ALTER TYPE "public"."enum__blogs_v_blocks_hero_split_layout_content_side" RENAME TO "enum_blogs_v_hero_split_side";
    ALTER TYPE "public"."enum__blogs_v_blocks_hero_split_layout_media_type" RENAME TO "enum_blogs_v_hero_split_media";
    ALTER TYPE "public"."enum__blogs_v_blocks_hero_gradient_config_animation" RENAME TO "enum_blogs_v_hero_grad_anim";
    ALTER TYPE "public"."enum__blogs_v_blocks_hero_settings_overlay_color" RENAME TO "enum_blogs_v_hero_overlay_color";
    ALTER TYPE "public"."enum__blogs_v_blocks_content_columns_background_color" RENAME TO "enum_blogs_v_content_col_bg";
    ALTER TYPE "public"."enum__blogs_v_blocks_content_columns_padding" RENAME TO "enum_blogs_v_content_col_pad";
    ALTER TYPE "public"."enum__blogs_v_blocks_feature_grid_columns" RENAME TO "enum_blogs_v_feat_grid_cols";
    ALTER TYPE "public"."enum__blogs_v_blocks_feature_grid_style" RENAME TO "enum_blogs_v_feat_grid_style";
    ALTER TYPE "public"."enum__blogs_v_blocks_stats_counter_layout" RENAME TO "enum_blogs_v_stats_layout";
    ALTER TYPE "public"."enum__blogs_v_blocks_timeline_orientation" RENAME TO "enum_blogs_v_timeline_orient";
    ALTER TYPE "public"."enum__blogs_v_blocks_newsletter_provider" RENAME TO "enum_blogs_v_newsletter_provider";
    ALTER TYPE "public"."enum__blogs_v_blocks_social_proof_type" RENAME TO "enum_blogs_v_social_type";
    ALTER TYPE "public"."enum__blogs_v_blocks_social_proof_layout" RENAME TO "enum_blogs_v_social_layout";
    ALTER TYPE "public"."enum__blogs_v_blocks_container_max_width" RENAME TO "enum_blogs_v_container_width";
    ALTER TYPE "public"."enum__blogs_v_blocks_container_background_color" RENAME TO "enum_blogs_v_container_bg";
    ALTER TYPE "public"."enum__blogs_v_blocks_container_padding_top" RENAME TO "enum_blogs_v_container_pad_top";
    ALTER TYPE "public"."enum__blogs_v_blocks_container_padding_bottom" RENAME TO "enum_blogs_v_container_pad_bot";
    ALTER TYPE "public"."enum__blogs_v_blocks_container_margin_top" RENAME TO "enum_blogs_v_container_mar_top";
    ALTER TYPE "public"."enum__blogs_v_blocks_container_margin_bottom" RENAME TO "enum_blogs_v_container_mar_bot";
    ALTER TYPE "public"."enum__blogs_v_blocks_divider_spacing_top" RENAME TO "enum_blogs_v_divider_space_top";
    ALTER TYPE "public"."enum__blogs_v_blocks_divider_spacing_bottom" RENAME TO "enum_blogs_v_divider_space_bot";
    ALTER TYPE "public"."enum__blogs_v_version_meta_structured_type" RENAME TO "enum_blogs_v_meta_struct_type";
    ALTER TYPE "public"."enum__blogs_v_version_meta_social_twitter_card" RENAME TO "enum_blogs_v_meta_twitter_card";

    -- Rename services enum types (similar patterns for services)
    ALTER TYPE "public"."enum_services_blocks_hero_code_snippet_language" RENAME TO "enum_services_hero_code_lang";
    ALTER TYPE "public"."enum_services_blocks_hero_code_snippet_theme" RENAME TO "enum_services_hero_code_theme";
    ALTER TYPE "public"."enum_services_blocks_hero_split_layout_content_side" RENAME TO "enum_services_hero_split_side";
    ALTER TYPE "public"."enum_services_blocks_hero_split_layout_media_type" RENAME TO "enum_services_hero_split_media";
    ALTER TYPE "public"."enum_services_blocks_hero_gradient_config_animation" RENAME TO "enum_services_hero_grad_anim";
    ALTER TYPE "public"."enum_services_blocks_hero_settings_overlay_color" RENAME TO "enum_services_hero_overlay_color";
    ALTER TYPE "public"."enum_services_blocks_content_columns_background_color" RENAME TO "enum_services_content_col_bg";
    ALTER TYPE "public"."enum_services_blocks_content_columns_padding" RENAME TO "enum_services_content_col_pad";
    ALTER TYPE "public"."enum_services_blocks_services_grid_columns" RENAME TO "enum_services_svc_grid_cols";
    ALTER TYPE "public"."enum_services_blocks_services_grid_style" RENAME TO "enum_services_svc_grid_style";
    ALTER TYPE "public"."enum_services_blocks_tech_stack_technologies_category" RENAME TO "enum_services_tech_cat";
    ALTER TYPE "public"."enum_services_blocks_tech_stack_technologies_proficiency" RENAME TO "enum_services_tech_prof";
    ALTER TYPE "public"."enum_services_blocks_process_steps_layout" RENAME TO "enum_services_process_layout";
    ALTER TYPE "public"."enum_services_blocks_process_steps_style" RENAME TO "enum_services_process_style";
    ALTER TYPE "public"."enum_services_blocks_pricing_table_tiers_period" RENAME TO "enum_services_price_period";
    ALTER TYPE "public"."enum_services_blocks_pricing_table_billing_period" RENAME TO "enum_services_price_billing";
    ALTER TYPE "public"."enum_services_blocks_testimonial_layout" RENAME TO "enum_services_testimonial_layout";
    ALTER TYPE "public"."enum_services_blocks_feature_grid_columns" RENAME TO "enum_services_feat_grid_cols";
    ALTER TYPE "public"."enum_services_blocks_feature_grid_style" RENAME TO "enum_services_feat_grid_style";
    ALTER TYPE "public"."enum_services_blocks_stats_counter_layout" RENAME TO "enum_services_stats_layout";
    ALTER TYPE "public"."enum_services_blocks_contact_form_layout" RENAME TO "enum_services_contact_layout";
    ALTER TYPE "public"."enum_services_blocks_newsletter_provider" RENAME TO "enum_services_newsletter_provider";
    ALTER TYPE "public"."enum_services_blocks_social_proof_type" RENAME TO "enum_services_social_type";
    ALTER TYPE "public"."enum_services_blocks_social_proof_layout" RENAME TO "enum_services_social_layout";
    ALTER TYPE "public"."enum_services_blocks_container_max_width" RENAME TO "enum_services_container_width";
    ALTER TYPE "public"."enum_services_blocks_container_background_color" RENAME TO "enum_services_container_bg";
    ALTER TYPE "public"."enum_services_blocks_container_padding_top" RENAME TO "enum_services_container_pad_top";
    ALTER TYPE "public"."enum_services_blocks_container_padding_bottom" RENAME TO "enum_services_container_pad_bot";
    ALTER TYPE "public"."enum_services_blocks_container_margin_top" RENAME TO "enum_services_container_mar_top";
    ALTER TYPE "public"."enum_services_blocks_container_margin_bottom" RENAME TO "enum_services_container_mar_bot";
    ALTER TYPE "public"."enum_services_blocks_divider_spacing_top" RENAME TO "enum_services_divider_space_top";
    ALTER TYPE "public"."enum_services_blocks_divider_spacing_bottom" RENAME TO "enum_services_divider_space_bot";

    -- Rename table identifiers for optimization
    ALTER TABLE "public"."pages_blocks_hero_gradient_config_colors" RENAME TO "pages_hero_grad_colors";
    ALTER TABLE "public"."pages_blocks_services_grid_services_features" RENAME TO "pages_svc_grid_svc_feat";
    ALTER TABLE "public"."pages_blocks_services_grid_services" RENAME TO "pages_svc_grid_services";
    ALTER TABLE "public"."pages_blocks_tech_stack_technologies" RENAME TO "pages_tech_stack_tech";
    ALTER TABLE "public"."pages_blocks_process_steps_steps" RENAME TO "pages_process_steps";
    ALTER TABLE "public"."pages_blocks_pricing_table_tiers_features" RENAME TO "pages_price_tier_feat";
    ALTER TABLE "public"."pages_blocks_pricing_table_tiers" RENAME TO "pages_price_tiers";
    ALTER TABLE "public"."pages_blocks_project_showcase_projects_technologies" RENAME TO "pages_proj_show_proj_tech";
    ALTER TABLE "public"."pages_blocks_project_showcase_projects" RENAME TO "pages_proj_show_projects";
    ALTER TABLE "public"."pages_blocks_project_showcase_filter_categories" RENAME TO "pages_proj_show_filter_cat";
    ALTER TABLE "public"."pages_blocks_case_study_approach_steps" RENAME TO "pages_case_study_approach";
    ALTER TABLE "public"."pages_blocks_case_study_solution_technologies" RENAME TO "pages_case_study_sol_tech";
    ALTER TABLE "public"."pages_blocks_case_study_results_metrics" RENAME TO "pages_case_study_metrics";
    ALTER TABLE "public"."pages_blocks_testimonial_testimonials" RENAME TO "pages_testimonials";
    ALTER TABLE "public"."pages_blocks_feature_grid_features" RENAME TO "pages_feat_grid_features";
    ALTER TABLE "public"."pages_blocks_stats_counter_stats" RENAME TO "pages_stats_counter_stats";
    ALTER TABLE "public"."pages_blocks_faq_accordion_faqs" RENAME TO "pages_faq_accordion_faqs";
    ALTER TABLE "public"."pages_blocks_timeline_items" RENAME TO "pages_timeline_items";
    ALTER TABLE "public"."pages_blocks_social_proof_logos" RENAME TO "pages_social_proof_logos";
    ALTER TABLE "public"."pages_blocks_social_proof_stats" RENAME TO "pages_social_proof_stats";
    ALTER TABLE "public"."pages_blocks_social_proof_badges" RENAME TO "pages_social_proof_badges";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Rollback: Rename table identifiers back to original names
    ALTER TABLE "public"."pages_social_proof_badges" RENAME TO "pages_blocks_social_proof_badges";
    ALTER TABLE "public"."pages_social_proof_stats" RENAME TO "pages_blocks_social_proof_stats";
    ALTER TABLE "public"."pages_social_proof_logos" RENAME TO "pages_blocks_social_proof_logos";
    ALTER TABLE "public"."pages_timeline_items" RENAME TO "pages_blocks_timeline_items";
    ALTER TABLE "public"."pages_faq_accordion_faqs" RENAME TO "pages_blocks_faq_accordion_faqs";
    ALTER TABLE "public"."pages_stats_counter_stats" RENAME TO "pages_blocks_stats_counter_stats";
    ALTER TABLE "public"."pages_feat_grid_features" RENAME TO "pages_blocks_feature_grid_features";
    ALTER TABLE "public"."pages_testimonials" RENAME TO "pages_blocks_testimonial_testimonials";
    ALTER TABLE "public"."pages_case_study_metrics" RENAME TO "pages_blocks_case_study_results_metrics";
    ALTER TABLE "public"."pages_case_study_sol_tech" RENAME TO "pages_blocks_case_study_solution_technologies";
    ALTER TABLE "public"."pages_case_study_approach" RENAME TO "pages_blocks_case_study_approach_steps";
    ALTER TABLE "public"."pages_proj_show_filter_cat" RENAME TO "pages_blocks_project_showcase_filter_categories";
    ALTER TABLE "public"."pages_proj_show_projects" RENAME TO "pages_blocks_project_showcase_projects";
    ALTER TABLE "public"."pages_proj_show_proj_tech" RENAME TO "pages_blocks_project_showcase_projects_technologies";
    ALTER TABLE "public"."pages_price_tiers" RENAME TO "pages_blocks_pricing_table_tiers";
    ALTER TABLE "public"."pages_price_tier_feat" RENAME TO "pages_blocks_pricing_table_tiers_features";
    ALTER TABLE "public"."pages_process_steps" RENAME TO "pages_blocks_process_steps_steps";
    ALTER TABLE "public"."pages_tech_stack_tech" RENAME TO "pages_blocks_tech_stack_technologies";
    ALTER TABLE "public"."pages_svc_grid_services" RENAME TO "pages_blocks_services_grid_services";
    ALTER TABLE "public"."pages_svc_grid_svc_feat" RENAME TO "pages_blocks_services_grid_services_features";
    ALTER TABLE "public"."pages_hero_grad_colors" RENAME TO "pages_blocks_hero_gradient_config_colors";

    -- Rollback: Rename services enum types back to original names
    ALTER TYPE "public"."enum_services_divider_space_bot" RENAME TO "enum_services_blocks_divider_spacing_bottom";
    ALTER TYPE "public"."enum_services_divider_space_top" RENAME TO "enum_services_blocks_divider_spacing_top";
    ALTER TYPE "public"."enum_services_container_mar_bot" RENAME TO "enum_services_blocks_container_margin_bottom";
    ALTER TYPE "public"."enum_services_container_mar_top" RENAME TO "enum_services_blocks_container_margin_top";
    ALTER TYPE "public"."enum_services_container_pad_bot" RENAME TO "enum_services_blocks_container_padding_bottom";
    ALTER TYPE "public"."enum_services_container_pad_top" RENAME TO "enum_services_blocks_container_padding_top";
    ALTER TYPE "public"."enum_services_container_bg" RENAME TO "enum_services_blocks_container_background_color";
    ALTER TYPE "public"."enum_services_container_width" RENAME TO "enum_services_blocks_container_max_width";
    ALTER TYPE "public"."enum_services_social_layout" RENAME TO "enum_services_blocks_social_proof_layout";
    ALTER TYPE "public"."enum_services_social_type" RENAME TO "enum_services_blocks_social_proof_type";
    ALTER TYPE "public"."enum_services_newsletter_provider" RENAME TO "enum_services_blocks_newsletter_provider";
    ALTER TYPE "public"."enum_services_contact_layout" RENAME TO "enum_services_blocks_contact_form_layout";
    ALTER TYPE "public"."enum_services_stats_layout" RENAME TO "enum_services_blocks_stats_counter_layout";
    ALTER TYPE "public"."enum_services_feat_grid_style" RENAME TO "enum_services_blocks_feature_grid_style";
    ALTER TYPE "public"."enum_services_feat_grid_cols" RENAME TO "enum_services_blocks_feature_grid_columns";
    ALTER TYPE "public"."enum_services_testimonial_layout" RENAME TO "enum_services_blocks_testimonial_layout";
    ALTER TYPE "public"."enum_services_price_billing" RENAME TO "enum_services_blocks_pricing_table_billing_period";
    ALTER TYPE "public"."enum_services_price_period" RENAME TO "enum_services_blocks_pricing_table_tiers_period";
    ALTER TYPE "public"."enum_services_process_style" RENAME TO "enum_services_blocks_process_steps_style";
    ALTER TYPE "public"."enum_services_process_layout" RENAME TO "enum_services_blocks_process_steps_layout";
    ALTER TYPE "public"."enum_services_tech_prof" RENAME TO "enum_services_blocks_tech_stack_technologies_proficiency";
    ALTER TYPE "public"."enum_services_tech_cat" RENAME TO "enum_services_blocks_tech_stack_technologies_category";
    ALTER TYPE "public"."enum_services_svc_grid_style" RENAME TO "enum_services_blocks_services_grid_style";
    ALTER TYPE "public"."enum_services_svc_grid_cols" RENAME TO "enum_services_blocks_services_grid_columns";
    ALTER TYPE "public"."enum_services_content_col_pad" RENAME TO "enum_services_blocks_content_columns_padding";
    ALTER TYPE "public"."enum_services_content_col_bg" RENAME TO "enum_services_blocks_content_columns_background_color";
    ALTER TYPE "public"."enum_services_hero_overlay_color" RENAME TO "enum_services_blocks_hero_settings_overlay_color";
    ALTER TYPE "public"."enum_services_hero_grad_anim" RENAME TO "enum_services_blocks_hero_gradient_config_animation";
    ALTER TYPE "public"."enum_services_hero_split_media" RENAME TO "enum_services_blocks_hero_split_layout_media_type";
    ALTER TYPE "public"."enum_services_hero_split_side" RENAME TO "enum_services_blocks_hero_split_layout_content_side";
    ALTER TYPE "public"."enum_services_hero_code_theme" RENAME TO "enum_services_blocks_hero_code_snippet_theme";
    ALTER TYPE "public"."enum_services_hero_code_lang" RENAME TO "enum_services_blocks_hero_code_snippet_language";

    -- Rollback: Rename blog version enum types back to original names
    ALTER TYPE "public"."enum_blogs_v_meta_twitter_card" RENAME TO "enum__blogs_v_version_meta_social_twitter_card";
    ALTER TYPE "public"."enum_blogs_v_meta_struct_type" RENAME TO "enum__blogs_v_version_meta_structured_type";
    ALTER TYPE "public"."enum_blogs_v_divider_space_bot" RENAME TO "enum__blogs_v_blocks_divider_spacing_bottom";
    ALTER TYPE "public"."enum_blogs_v_divider_space_top" RENAME TO "enum__blogs_v_blocks_divider_spacing_top";
    ALTER TYPE "public"."enum_blogs_v_container_mar_bot" RENAME TO "enum__blogs_v_blocks_container_margin_bottom";
    ALTER TYPE "public"."enum_blogs_v_container_mar_top" RENAME TO "enum__blogs_v_blocks_container_margin_top";
    ALTER TYPE "public"."enum_blogs_v_container_pad_bot" RENAME TO "enum__blogs_v_blocks_container_padding_bottom";
    ALTER TYPE "public"."enum_blogs_v_container_pad_top" RENAME TO "enum__blogs_v_blocks_container_padding_top";
    ALTER TYPE "public"."enum_blogs_v_container_bg" RENAME TO "enum__blogs_v_blocks_container_background_color";
    ALTER TYPE "public"."enum_blogs_v_container_width" RENAME TO "enum__blogs_v_blocks_container_max_width";
    ALTER TYPE "public"."enum_blogs_v_social_layout" RENAME TO "enum__blogs_v_blocks_social_proof_layout";
    ALTER TYPE "public"."enum_blogs_v_social_type" RENAME TO "enum__blogs_v_blocks_social_proof_type";
    ALTER TYPE "public"."enum_blogs_v_newsletter_provider" RENAME TO "enum__blogs_v_blocks_newsletter_provider";
    ALTER TYPE "public"."enum_blogs_v_timeline_orient" RENAME TO "enum__blogs_v_blocks_timeline_orientation";
    ALTER TYPE "public"."enum_blogs_v_stats_layout" RENAME TO "enum__blogs_v_blocks_stats_counter_layout";
    ALTER TYPE "public"."enum_blogs_v_feat_grid_style" RENAME TO "enum__blogs_v_blocks_feature_grid_style";
    ALTER TYPE "public"."enum_blogs_v_feat_grid_cols" RENAME TO "enum__blogs_v_blocks_feature_grid_columns";
    ALTER TYPE "public"."enum_blogs_v_content_col_pad" RENAME TO "enum__blogs_v_blocks_content_columns_padding";
    ALTER TYPE "public"."enum_blogs_v_content_col_bg" RENAME TO "enum__blogs_v_blocks_content_columns_background_color";
    ALTER TYPE "public"."enum_blogs_v_hero_overlay_color" RENAME TO "enum__blogs_v_blocks_hero_settings_overlay_color";
    ALTER TYPE "public"."enum_blogs_v_hero_grad_anim" RENAME TO "enum__blogs_v_blocks_hero_gradient_config_animation";
    ALTER TYPE "public"."enum_blogs_v_hero_split_media" RENAME TO "enum__blogs_v_blocks_hero_split_layout_media_type";
    ALTER TYPE "public"."enum_blogs_v_hero_split_side" RENAME TO "enum__blogs_v_blocks_hero_split_layout_content_side";
    ALTER TYPE "public"."enum_blogs_v_hero_code_theme" RENAME TO "enum__blogs_v_blocks_hero_code_snippet_theme";
    ALTER TYPE "public"."enum_blogs_v_hero_code_lang" RENAME TO "enum__blogs_v_blocks_hero_code_snippet_language";

    -- Rollback: Rename blog enum types back to original names
    ALTER TYPE "public"."enum_blogs_meta_twitter_card" RENAME TO "enum_blogs_meta_social_twitter_card";
    ALTER TYPE "public"."enum_blogs_meta_struct_type" RENAME TO "enum_blogs_meta_structured_type";
    ALTER TYPE "public"."enum_blogs_divider_space_bot" RENAME TO "enum_blogs_blocks_divider_spacing_bottom";
    ALTER TYPE "public"."enum_blogs_divider_space_top" RENAME TO "enum_blogs_blocks_divider_spacing_top";
    ALTER TYPE "public"."enum_blogs_container_mar_bot" RENAME TO "enum_blogs_blocks_container_margin_bottom";
    ALTER TYPE "public"."enum_blogs_container_mar_top" RENAME TO "enum_blogs_blocks_container_margin_top";
    ALTER TYPE "public"."enum_blogs_container_pad_bot" RENAME TO "enum_blogs_blocks_container_padding_bottom";
    ALTER TYPE "public"."enum_blogs_container_pad_top" RENAME TO "enum_blogs_blocks_container_padding_top";
    ALTER TYPE "public"."enum_blogs_container_bg" RENAME TO "enum_blogs_blocks_container_background_color";
    ALTER TYPE "public"."enum_blogs_container_width" RENAME TO "enum_blogs_blocks_container_max_width";
    ALTER TYPE "public"."enum_blogs_social_layout" RENAME TO "enum_blogs_blocks_social_proof_layout";
    ALTER TYPE "public"."enum_blogs_social_type" RENAME TO "enum_blogs_blocks_social_proof_type";
    ALTER TYPE "public"."enum_blogs_newsletter_provider" RENAME TO "enum_blogs_blocks_newsletter_provider";
    ALTER TYPE "public"."enum_blogs_timeline_orient" RENAME TO "enum_blogs_blocks_timeline_orientation";
    ALTER TYPE "public"."enum_blogs_stats_layout" RENAME TO "enum_blogs_blocks_stats_counter_layout";
    ALTER TYPE "public"."enum_blogs_feat_grid_style" RENAME TO "enum_blogs_blocks_feature_grid_style";
    ALTER TYPE "public"."enum_blogs_feat_grid_cols" RENAME TO "enum_blogs_blocks_feature_grid_columns";
    ALTER TYPE "public"."enum_blogs_content_col_pad" RENAME TO "enum_blogs_blocks_content_columns_padding";
    ALTER TYPE "public"."enum_blogs_content_col_bg" RENAME TO "enum_blogs_blocks_content_columns_background_color";
    ALTER TYPE "public"."enum_blogs_hero_overlay_color" RENAME TO "enum_blogs_blocks_hero_settings_overlay_color";
    ALTER TYPE "public"."enum_blogs_hero_grad_anim" RENAME TO "enum_blogs_blocks_hero_gradient_config_animation";
    ALTER TYPE "public"."enum_blogs_hero_split_media" RENAME TO "enum_blogs_blocks_hero_split_layout_media_type";
    ALTER TYPE "public"."enum_blogs_hero_split_side" RENAME TO "enum_blogs_blocks_hero_split_layout_content_side";
    ALTER TYPE "public"."enum_blogs_hero_code_theme" RENAME TO "enum_blogs_blocks_hero_code_snippet_theme";
    ALTER TYPE "public"."enum_blogs_hero_code_lang" RENAME TO "enum_blogs_blocks_hero_code_snippet_language";

    -- Rollback: Rename version enum types back to original names
    ALTER TYPE "public"."enum_pages_v_meta_twitter_card" RENAME TO "enum__pages_v_version_meta_social_twitter_card";
    ALTER TYPE "public"."enum_pages_v_meta_struct_type" RENAME TO "enum__pages_v_version_meta_structured_type";
    ALTER TYPE "public"."enum_pages_v_divider_space_bot" RENAME TO "enum__pages_v_blocks_divider_spacing_bottom";
    ALTER TYPE "public"."enum_pages_v_divider_space_top" RENAME TO "enum__pages_v_blocks_divider_spacing_top";
    ALTER TYPE "public"."enum_pages_v_container_mar_bot" RENAME TO "enum__pages_v_blocks_container_margin_bottom";
    ALTER TYPE "public"."enum_pages_v_container_mar_top" RENAME TO "enum__pages_v_blocks_container_margin_top";
    ALTER TYPE "public"."enum_pages_v_container_pad_bot" RENAME TO "enum__pages_v_blocks_container_padding_bottom";
    ALTER TYPE "public"."enum_pages_v_container_pad_top" RENAME TO "enum__pages_v_blocks_container_padding_top";
    ALTER TYPE "public"."enum_pages_v_container_bg" RENAME TO "enum__pages_v_blocks_container_background_color";
    ALTER TYPE "public"."enum_pages_v_container_width" RENAME TO "enum__pages_v_blocks_container_max_width";
    ALTER TYPE "public"."enum_pages_v_social_layout" RENAME TO "enum__pages_v_blocks_social_proof_layout";
    ALTER TYPE "public"."enum_pages_v_social_type" RENAME TO "enum__pages_v_blocks_social_proof_type";
    ALTER TYPE "public"."enum_pages_v_newsletter_provider" RENAME TO "enum__pages_v_blocks_newsletter_provider";
    ALTER TYPE "public"."enum_pages_v_contact_layout" RENAME TO "enum__pages_v_blocks_contact_form_layout";
    ALTER TYPE "public"."enum_pages_v_timeline_orient" RENAME TO "enum__pages_v_blocks_timeline_orientation";
    ALTER TYPE "public"."enum_pages_v_stats_layout" RENAME TO "enum__pages_v_blocks_stats_counter_layout";
    ALTER TYPE "public"."enum_pages_v_feat_grid_style" RENAME TO "enum__pages_v_blocks_feature_grid_style";
    ALTER TYPE "public"."enum_pages_v_feat_grid_cols" RENAME TO "enum__pages_v_blocks_feature_grid_columns";
    ALTER TYPE "public"."enum_pages_v_before_after_orient" RENAME TO "enum__pages_v_blocks_before_after_orientation";
    ALTER TYPE "public"."enum_pages_v_proj_cols" RENAME TO "enum__pages_v_blocks_project_showcase_columns";
    ALTER TYPE "public"."enum_pages_v_proj_layout" RENAME TO "enum__pages_v_blocks_project_showcase_layout";
    ALTER TYPE "public"."enum_pages_v_price_billing" RENAME TO "enum__pages_v_blocks_pricing_table_billing_period";
    ALTER TYPE "public"."enum_pages_v_price_period" RENAME TO "enum__pages_v_blocks_pricing_table_tiers_period";
    ALTER TYPE "public"."enum_pages_v_tech_prof" RENAME TO "enum__pages_v_blocks_tech_stack_technologies_proficiency";
    ALTER TYPE "public"."enum_pages_v_tech_cat" RENAME TO "enum__pages_v_blocks_tech_stack_technologies_category";
    ALTER TYPE "public"."enum_pages_v_content_col_pad" RENAME TO "enum__pages_v_blocks_content_columns_padding";
    ALTER TYPE "public"."enum_pages_v_content_col_bg" RENAME TO "enum__pages_v_blocks_content_columns_background_color";
    ALTER TYPE "public"."enum_pages_v_hero_overlay_color" RENAME TO "enum__pages_v_blocks_hero_settings_overlay_color";
    ALTER TYPE "public"."enum_pages_v_hero_grad_anim" RENAME TO "enum__pages_v_blocks_hero_gradient_config_animation";
    ALTER TYPE "public"."enum_pages_v_hero_split_media" RENAME TO "enum__pages_v_blocks_hero_split_layout_media_type";
    ALTER TYPE "public"."enum_pages_v_hero_split_side" RENAME TO "enum__pages_v_blocks_hero_split_layout_content_side";
    ALTER TYPE "public"."enum_pages_v_hero_code_theme" RENAME TO "enum__pages_v_blocks_hero_code_snippet_theme";
    ALTER TYPE "public"."enum_pages_v_hero_code_lang" RENAME TO "enum__pages_v_blocks_hero_code_snippet_language";

    -- Rollback: Rename Meta enum types back to original names
    ALTER TYPE "public"."enum_pages_meta_twitter_card" RENAME TO "enum_pages_meta_social_twitter_card";
    ALTER TYPE "public"."enum_pages_meta_struct_type" RENAME TO "enum_pages_meta_structured_type";

    -- Rollback: Rename Divider enum types back to original names
    ALTER TYPE "public"."enum_pages_divider_space_bot" RENAME TO "enum_pages_blocks_divider_spacing_bottom";
    ALTER TYPE "public"."enum_pages_divider_space_top" RENAME TO "enum_pages_blocks_divider_spacing_top";

    -- Rollback: Rename Container enum types back to original names
    ALTER TYPE "public"."enum_pages_container_mar_bot" RENAME TO "enum_pages_blocks_container_margin_bottom";
    ALTER TYPE "public"."enum_pages_container_mar_top" RENAME TO "enum_pages_blocks_container_margin_top";
    ALTER TYPE "public"."enum_pages_container_pad_bot" RENAME TO "enum_pages_blocks_container_padding_bottom";
    ALTER TYPE "public"."enum_pages_container_pad_top" RENAME TO "enum_pages_blocks_container_padding_top";
    ALTER TYPE "public"."enum_pages_container_bg" RENAME TO "enum_pages_blocks_container_background_color";
    ALTER TYPE "public"."enum_pages_container_width" RENAME TO "enum_pages_blocks_container_max_width";

    -- Rollback: Rename Social Proof enum types back to original names
    ALTER TYPE "public"."enum_pages_social_layout" RENAME TO "enum_pages_blocks_social_proof_layout";
    ALTER TYPE "public"."enum_pages_social_type" RENAME TO "enum_pages_blocks_social_proof_type";

    -- Rollback: Rename Newsletter enum types back to original names
    ALTER TYPE "public"."enum_pages_newsletter_provider" RENAME TO "enum_pages_blocks_newsletter_provider";

    -- Rollback: Rename Contact Form enum types back to original names
    ALTER TYPE "public"."enum_pages_contact_layout" RENAME TO "enum_pages_blocks_contact_form_layout";

    -- Rollback: Rename Timeline enum types back to original names
    ALTER TYPE "public"."enum_pages_timeline_orient" RENAME TO "enum_pages_blocks_timeline_orientation";

    -- Rollback: Rename Stats Counter enum types back to original names
    ALTER TYPE "public"."enum_pages_stats_layout" RENAME TO "enum_pages_blocks_stats_counter_layout";

    -- Rollback: Rename Feature Grid enum types back to original names
    ALTER TYPE "public"."enum_pages_feat_grid_style" RENAME TO "enum_pages_blocks_feature_grid_style";
    ALTER TYPE "public"."enum_pages_feat_grid_cols" RENAME TO "enum_pages_blocks_feature_grid_columns";

    -- Rollback: Rename Before/After enum types back to original names
    ALTER TYPE "public"."enum_pages_before_after_orient" RENAME TO "enum_pages_blocks_before_after_orientation";

    -- Rollback: Rename Project Showcase enum types back to original names
    ALTER TYPE "public"."enum_pages_proj_cols" RENAME TO "enum_pages_blocks_project_showcase_columns";
    ALTER TYPE "public"."enum_pages_proj_layout" RENAME TO "enum_pages_blocks_project_showcase_layout";

    -- Rollback: Rename Pricing Table enum types back to original names
    ALTER TYPE "public"."enum_pages_price_billing" RENAME TO "enum_pages_blocks_pricing_table_billing_period";
    ALTER TYPE "public"."enum_pages_price_period" RENAME TO "enum_pages_blocks_pricing_table_tiers_period";

    -- Rollback: Rename Tech Stack enum types back to original names
    ALTER TYPE "public"."enum_pages_tech_prof" RENAME TO "enum_pages_blocks_tech_stack_technologies_proficiency";
    ALTER TYPE "public"."enum_pages_tech_cat" RENAME TO "enum_pages_blocks_tech_stack_technologies_category";

    -- Rollback: Rename Content enum types back to original names
    ALTER TYPE "public"."enum_pages_content_col_pad" RENAME TO "enum_pages_blocks_content_columns_padding";
    ALTER TYPE "public"."enum_pages_content_col_bg" RENAME TO "enum_pages_blocks_content_columns_background_color";

    -- Rollback: Rename Hero enum types back to original names
    ALTER TYPE "public"."enum_pages_hero_overlay_color" RENAME TO "enum_pages_blocks_hero_settings_overlay_color";
    ALTER TYPE "public"."enum_pages_hero_grad_anim" RENAME TO "enum_pages_blocks_hero_gradient_config_animation";
    ALTER TYPE "public"."enum_pages_hero_split_media" RENAME TO "enum_pages_blocks_hero_split_layout_media_type";
    ALTER TYPE "public"."enum_pages_hero_split_side" RENAME TO "enum_pages_blocks_hero_split_layout_content_side";
    ALTER TYPE "public"."enum_pages_hero_code_theme" RENAME TO "enum_pages_blocks_hero_code_snippet_theme";
    ALTER TYPE "public"."enum_pages_hero_code_lang" RENAME TO "enum_pages_blocks_hero_code_snippet_language";
  `)
}
