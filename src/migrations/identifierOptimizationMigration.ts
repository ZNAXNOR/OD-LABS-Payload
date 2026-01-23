import {
  DatabaseMigrationGenerator,
  generateEnumRenames,
  generateTableRenames,
  DbIdentifierChange,
} from './utils/migrationGenerator'

/**
 * Database identifier optimization migration
 *
 * This migration renames database identifiers to comply with PostgreSQL's
 * 63-character limit while preserving data integrity and semantic meaning.
 */

/**
 * Enum identifier mappings for optimization
 * Maps long enum names to their optimized versions
 */
const ENUM_IDENTIFIER_MAPPINGS: Record<string, string> = {
  // Hero block enums - optimize deeply nested structures
  enum_pages_blocks_hero_code_snippet_language: 'enum_pages_hero_code_lang',
  enum_pages_blocks_hero_code_snippet_theme: 'enum_pages_hero_code_theme',
  enum_pages_blocks_hero_split_layout_content_side: 'enum_pages_hero_split_side',
  enum_pages_blocks_hero_split_layout_media_type: 'enum_pages_hero_split_media',
  enum_pages_blocks_hero_gradient_config_animation: 'enum_pages_hero_grad_anim',
  enum_pages_blocks_hero_settings_overlay_color: 'enum_pages_hero_overlay_color',

  // Content block enums
  enum_pages_blocks_content_columns_background_color: 'enum_pages_content_col_bg',
  enum_pages_blocks_content_columns_padding: 'enum_pages_content_col_pad',

  // Tech stack enums - very long identifiers
  enum_pages_blocks_tech_stack_technologies_category: 'enum_pages_tech_cat',
  enum_pages_blocks_tech_stack_technologies_proficiency: 'enum_pages_tech_prof',

  // Pricing table enums
  enum_pages_blocks_pricing_table_tiers_period: 'enum_pages_price_period',
  enum_pages_blocks_pricing_table_billing_period: 'enum_pages_price_billing',

  // Project showcase enums
  enum_pages_blocks_project_showcase_layout: 'enum_pages_proj_layout',
  enum_pages_blocks_project_showcase_columns: 'enum_pages_proj_cols',

  // Before/after enums
  enum_pages_blocks_before_after_orientation: 'enum_pages_before_after_orient',

  // Feature grid enums
  enum_pages_blocks_feature_grid_columns: 'enum_pages_feat_grid_cols',
  enum_pages_blocks_feature_grid_style: 'enum_pages_feat_grid_style',

  // Stats counter enums
  enum_pages_blocks_stats_counter_layout: 'enum_pages_stats_layout',

  // Timeline enums
  enum_pages_blocks_timeline_orientation: 'enum_pages_timeline_orient',

  // Contact form enums
  enum_pages_blocks_contact_form_layout: 'enum_pages_contact_layout',

  // Newsletter enums
  enum_pages_blocks_newsletter_provider: 'enum_pages_newsletter_provider',

  // Social proof enums
  enum_pages_blocks_social_proof_type: 'enum_pages_social_type',
  enum_pages_blocks_social_proof_layout: 'enum_pages_social_layout',

  // Container enums
  enum_pages_blocks_container_max_width: 'enum_pages_container_width',
  enum_pages_blocks_container_background_color: 'enum_pages_container_bg',
  enum_pages_blocks_container_padding_top: 'enum_pages_container_pad_top',
  enum_pages_blocks_container_padding_bottom: 'enum_pages_container_pad_bot',
  enum_pages_blocks_container_margin_top: 'enum_pages_container_mar_top',
  enum_pages_blocks_container_margin_bottom: 'enum_pages_container_mar_bot',

  // Divider enums
  enum_pages_blocks_divider_spacing_top: 'enum_pages_divider_space_top',
  enum_pages_blocks_divider_spacing_bottom: 'enum_pages_divider_space_bot',

  // Meta enums
  enum_pages_meta_structured_type: 'enum_pages_meta_struct_type',
  enum_pages_meta_social_twitter_card: 'enum_pages_meta_twitter_card',

  // Version enums (similar patterns for _pages_v)
  enum__pages_v_blocks_hero_code_snippet_language: 'enum_pages_v_hero_code_lang',
  enum__pages_v_blocks_hero_code_snippet_theme: 'enum_pages_v_hero_code_theme',
  enum__pages_v_blocks_hero_split_layout_content_side: 'enum_pages_v_hero_split_side',
  enum__pages_v_blocks_hero_split_layout_media_type: 'enum_pages_v_hero_split_media',
  enum__pages_v_blocks_hero_gradient_config_animation: 'enum_pages_v_hero_grad_anim',
  enum__pages_v_blocks_hero_settings_overlay_color: 'enum_pages_v_hero_overlay_color',
  enum__pages_v_blocks_content_columns_background_color: 'enum_pages_v_content_col_bg',
  enum__pages_v_blocks_content_columns_padding: 'enum_pages_v_content_col_pad',
  enum__pages_v_blocks_tech_stack_technologies_category: 'enum_pages_v_tech_cat',
  enum__pages_v_blocks_tech_stack_technologies_proficiency: 'enum_pages_v_tech_prof',
  enum__pages_v_blocks_pricing_table_tiers_period: 'enum_pages_v_price_period',
  enum__pages_v_blocks_pricing_table_billing_period: 'enum_pages_v_price_billing',
  enum__pages_v_blocks_project_showcase_layout: 'enum_pages_v_proj_layout',
  enum__pages_v_blocks_project_showcase_columns: 'enum_pages_v_proj_cols',
  enum__pages_v_blocks_before_after_orientation: 'enum_pages_v_before_after_orient',
  enum__pages_v_blocks_feature_grid_columns: 'enum_pages_v_feat_grid_cols',
  enum__pages_v_blocks_feature_grid_style: 'enum_pages_v_feat_grid_style',
  enum__pages_v_blocks_stats_counter_layout: 'enum_pages_v_stats_layout',
  enum__pages_v_blocks_timeline_orientation: 'enum_pages_v_timeline_orient',
  enum__pages_v_blocks_contact_form_layout: 'enum_pages_v_contact_layout',
  enum__pages_v_blocks_newsletter_provider: 'enum_pages_v_newsletter_provider',
  enum__pages_v_blocks_social_proof_type: 'enum_pages_v_social_type',
  enum__pages_v_blocks_social_proof_layout: 'enum_pages_v_social_layout',
  enum__pages_v_blocks_container_max_width: 'enum_pages_v_container_width',
  enum__pages_v_blocks_container_background_color: 'enum_pages_v_container_bg',
  enum__pages_v_blocks_container_padding_top: 'enum_pages_v_container_pad_top',
  enum__pages_v_blocks_container_padding_bottom: 'enum_pages_v_container_pad_bot',
  enum__pages_v_blocks_container_margin_top: 'enum_pages_v_container_mar_top',
  enum__pages_v_blocks_container_margin_bottom: 'enum_pages_v_container_mar_bot',
  enum__pages_v_blocks_divider_spacing_top: 'enum_pages_v_divider_space_top',
  enum__pages_v_blocks_divider_spacing_bottom: 'enum_pages_v_divider_space_bot',
  enum__pages_v_version_meta_structured_type: 'enum_pages_v_meta_struct_type',
  enum__pages_v_version_meta_social_twitter_card: 'enum_pages_v_meta_twitter_card',

  // Blog enums (similar patterns for blogs)
  enum_blogs_blocks_hero_code_snippet_language: 'enum_blogs_hero_code_lang',
  enum_blogs_blocks_hero_code_snippet_theme: 'enum_blogs_hero_code_theme',
  enum_blogs_blocks_hero_split_layout_content_side: 'enum_blogs_hero_split_side',
  enum_blogs_blocks_hero_split_layout_media_type: 'enum_blogs_hero_split_media',
  enum_blogs_blocks_hero_gradient_config_animation: 'enum_blogs_hero_grad_anim',
  enum_blogs_blocks_hero_settings_overlay_color: 'enum_blogs_hero_overlay_color',
  enum_blogs_blocks_content_columns_background_color: 'enum_blogs_content_col_bg',
  enum_blogs_blocks_content_columns_padding: 'enum_blogs_content_col_pad',
  enum_blogs_blocks_feature_grid_columns: 'enum_blogs_feat_grid_cols',
  enum_blogs_blocks_feature_grid_style: 'enum_blogs_feat_grid_style',
  enum_blogs_blocks_stats_counter_layout: 'enum_blogs_stats_layout',
  enum_blogs_blocks_timeline_orientation: 'enum_blogs_timeline_orient',
  enum_blogs_blocks_newsletter_provider: 'enum_blogs_newsletter_provider',
  enum_blogs_blocks_social_proof_type: 'enum_blogs_social_type',
  enum_blogs_blocks_social_proof_layout: 'enum_blogs_social_layout',
  enum_blogs_blocks_container_max_width: 'enum_blogs_container_width',
  enum_blogs_blocks_container_background_color: 'enum_blogs_container_bg',
  enum_blogs_blocks_container_padding_top: 'enum_blogs_container_pad_top',
  enum_blogs_blocks_container_padding_bottom: 'enum_blogs_container_pad_bot',
  enum_blogs_blocks_container_margin_top: 'enum_blogs_container_mar_top',
  enum_blogs_blocks_container_margin_bottom: 'enum_blogs_container_mar_bot',
  enum_blogs_blocks_divider_spacing_top: 'enum_blogs_divider_space_top',
  enum_blogs_blocks_divider_spacing_bottom: 'enum_blogs_divider_space_bot',
  enum_blogs_meta_structured_type: 'enum_blogs_meta_struct_type',
  enum_blogs_meta_social_twitter_card: 'enum_blogs_meta_twitter_card',

  // Blog version enums
  enum__blogs_v_blocks_hero_code_snippet_language: 'enum_blogs_v_hero_code_lang',
  enum__blogs_v_blocks_hero_code_snippet_theme: 'enum_blogs_v_hero_code_theme',
  enum__blogs_v_blocks_hero_split_layout_content_side: 'enum_blogs_v_hero_split_side',
  enum__blogs_v_blocks_hero_split_layout_media_type: 'enum_blogs_v_hero_split_media',
  enum__blogs_v_blocks_hero_gradient_config_animation: 'enum_blogs_v_hero_grad_anim',
  enum__blogs_v_blocks_hero_settings_overlay_color: 'enum_blogs_v_hero_overlay_color',
  enum__blogs_v_blocks_content_columns_background_color: 'enum_blogs_v_content_col_bg',
  enum__blogs_v_blocks_content_columns_padding: 'enum_blogs_v_content_col_pad',
  enum__blogs_v_blocks_feature_grid_columns: 'enum_blogs_v_feat_grid_cols',
  enum__blogs_v_blocks_feature_grid_style: 'enum_blogs_v_feat_grid_style',
  enum__blogs_v_blocks_stats_counter_layout: 'enum_blogs_v_stats_layout',
  enum__blogs_v_blocks_timeline_orientation: 'enum_blogs_v_timeline_orient',
  enum__blogs_v_blocks_newsletter_provider: 'enum_blogs_v_newsletter_provider',
  enum__blogs_v_blocks_social_proof_type: 'enum_blogs_v_social_type',
  enum__blogs_v_blocks_social_proof_layout: 'enum_blogs_v_social_layout',
  enum__blogs_v_blocks_container_max_width: 'enum_blogs_v_container_width',
  enum__blogs_v_blocks_container_background_color: 'enum_blogs_v_container_bg',
  enum__blogs_v_blocks_container_padding_top: 'enum_blogs_v_container_pad_top',
  enum__blogs_v_blocks_container_padding_bottom: 'enum_blogs_v_container_pad_bot',
  enum__blogs_v_blocks_container_margin_top: 'enum_blogs_v_container_mar_top',
  enum__blogs_v_blocks_container_margin_bottom: 'enum_blogs_v_container_mar_bot',
  enum__blogs_v_blocks_divider_spacing_top: 'enum_blogs_v_divider_space_top',
  enum__blogs_v_blocks_divider_spacing_bottom: 'enum_blogs_v_divider_space_bot',
  enum__blogs_v_version_meta_structured_type: 'enum_blogs_v_meta_struct_type',
  enum__blogs_v_version_meta_social_twitter_card: 'enum_blogs_v_meta_twitter_card',

  // Services enums (similar patterns for services)
  enum_services_blocks_hero_code_snippet_language: 'enum_services_hero_code_lang',
  enum_services_blocks_hero_code_snippet_theme: 'enum_services_hero_code_theme',
  enum_services_blocks_hero_split_layout_content_side: 'enum_services_hero_split_side',
  enum_services_blocks_hero_split_layout_media_type: 'enum_services_hero_split_media',
  enum_services_blocks_hero_gradient_config_animation: 'enum_services_hero_grad_anim',
  enum_services_blocks_hero_settings_overlay_color: 'enum_services_hero_overlay_color',
  enum_services_blocks_content_columns_background_color: 'enum_services_content_col_bg',
  enum_services_blocks_content_columns_padding: 'enum_services_content_col_pad',
  enum_services_blocks_services_grid_columns: 'enum_services_svc_grid_cols',
  enum_services_blocks_services_grid_style: 'enum_services_svc_grid_style',
  enum_services_blocks_tech_stack_technologies_category: 'enum_services_tech_cat',
  enum_services_blocks_tech_stack_technologies_proficiency: 'enum_services_tech_prof',
  enum_services_blocks_process_steps_layout: 'enum_services_process_layout',
  enum_services_blocks_process_steps_style: 'enum_services_process_style',
  enum_services_blocks_pricing_table_tiers_period: 'enum_services_price_period',
  enum_services_blocks_pricing_table_billing_period: 'enum_services_price_billing',
  enum_services_blocks_testimonial_layout: 'enum_services_testimonial_layout',
  enum_services_blocks_feature_grid_columns: 'enum_services_feat_grid_cols',
  enum_services_blocks_feature_grid_style: 'enum_services_feat_grid_style',
  enum_services_blocks_stats_counter_layout: 'enum_services_stats_layout',
  enum_services_blocks_contact_form_layout: 'enum_services_contact_layout',
  enum_services_blocks_newsletter_provider: 'enum_services_newsletter_provider',
  enum_services_blocks_social_proof_type: 'enum_services_social_type',
  enum_services_blocks_social_proof_layout: 'enum_services_social_layout',
  enum_services_blocks_container_max_width: 'enum_services_container_width',
  enum_services_blocks_container_background_color: 'enum_services_container_bg',
  enum_services_blocks_container_padding_top: 'enum_services_container_pad_top',
  enum_services_blocks_container_padding_bottom: 'enum_services_container_pad_bot',
  enum_services_blocks_container_margin_top: 'enum_services_container_mar_top',
  enum_services_blocks_container_margin_bottom: 'enum_services_container_mar_bot',
  enum_services_blocks_divider_spacing_top: 'enum_services_divider_space_top',
  enum_services_blocks_divider_spacing_bottom: 'enum_services_divider_space_bot',
}

/**
 * Table identifier mappings for optimization
 * Maps long table names to their optimized versions
 */
const TABLE_IDENTIFIER_MAPPINGS: Record<string, string> = {
  // Hero block tables
  pages_blocks_hero_gradient_config_colors: 'pages_hero_grad_colors',

  // Services grid tables
  pages_blocks_services_grid_services_features: 'pages_svc_grid_svc_feat',
  pages_blocks_services_grid_services: 'pages_svc_grid_services',

  // Tech stack tables
  pages_blocks_tech_stack_technologies: 'pages_tech_stack_tech',

  // Process steps tables
  pages_blocks_process_steps_steps: 'pages_process_steps',

  // Pricing table tables
  pages_blocks_pricing_table_tiers_features: 'pages_price_tier_feat',
  pages_blocks_pricing_table_tiers: 'pages_price_tiers',

  // Project showcase tables
  pages_blocks_project_showcase_projects_technologies: 'pages_proj_show_proj_tech',
  pages_blocks_project_showcase_projects: 'pages_proj_show_projects',
  pages_blocks_project_showcase_filter_categories: 'pages_proj_show_filter_cat',

  // Case study tables
  pages_blocks_case_study_approach_steps: 'pages_case_study_approach',
  pages_blocks_case_study_solution_technologies: 'pages_case_study_sol_tech',
  pages_blocks_case_study_results_metrics: 'pages_case_study_metrics',

  // Testimonial tables
  pages_blocks_testimonial_testimonials: 'pages_testimonials',

  // Feature grid tables
  pages_blocks_feature_grid_features: 'pages_feat_grid_features',

  // Stats counter tables
  pages_blocks_stats_counter_stats: 'pages_stats_counter_stats',

  // FAQ accordion tables
  pages_blocks_faq_accordion_faqs: 'pages_faq_accordion_faqs',

  // Timeline tables
  pages_blocks_timeline_items: 'pages_timeline_items',

  // Social proof tables
  pages_blocks_social_proof_logos: 'pages_social_proof_logos',
  pages_blocks_social_proof_stats: 'pages_social_proof_stats',
  pages_blocks_social_proof_badges: 'pages_social_proof_badges',
}

/**
 * Generate the complete migration for identifier optimization
 */
export function generateIdentifierOptimizationMigration(): string {
  const generator = new DatabaseMigrationGenerator()

  // Add enum renames
  const enumChanges = generateEnumRenames(ENUM_IDENTIFIER_MAPPINGS)
  generator.addChanges(enumChanges)

  // Add table renames
  const tableChanges = generateTableRenames(TABLE_IDENTIFIER_MAPPINGS)
  generator.addChanges(tableChanges)

  // Validate all changes
  const validation = generator.validateChanges()
  if (!validation.isValid) {
    throw new Error(`Migration validation failed: ${validation.errors.join(', ')}`)
  }

  // Generate the migration file
  return generator.generateMigrationFile('Database Identifier Optimization')
}

/**
 * Get all identifier changes for analysis
 */
export function getAllIdentifierChanges(): DbIdentifierChange[] {
  const generator = new DatabaseMigrationGenerator()

  // Add all changes
  generator.addChanges(generateEnumRenames(ENUM_IDENTIFIER_MAPPINGS))
  generator.addChanges(generateTableRenames(TABLE_IDENTIFIER_MAPPINGS))

  return generator.getChanges()
}

/**
 * Validate identifier length compliance
 */
export function validateIdentifierLengths(): {
  compliant: boolean
  violations: Array<{ identifier: string; length: number; type: string }>
} {
  const violations: Array<{ identifier: string; length: number; type: string }> = []

  // Check enum mappings
  Object.entries(ENUM_IDENTIFIER_MAPPINGS).forEach(([oldName, newName]) => {
    if (oldName.length > 63) {
      violations.push({ identifier: oldName, length: oldName.length, type: 'enum (old)' })
    }
    if (newName.length > 63) {
      violations.push({ identifier: newName, length: newName.length, type: 'enum (new)' })
    }
  })

  // Check table mappings
  Object.entries(TABLE_IDENTIFIER_MAPPINGS).forEach(([oldName, newName]) => {
    if (oldName.length > 63) {
      violations.push({ identifier: oldName, length: oldName.length, type: 'table (old)' })
    }
    if (newName.length > 63) {
      violations.push({ identifier: newName, length: newName.length, type: 'table (new)' })
    }
  })

  return {
    compliant: violations.length === 0,
    violations,
  }
}

/**
 * Generate summary of identifier changes
 */
export function generateChangesSummary(): string {
  const enumCount = Object.keys(ENUM_IDENTIFIER_MAPPINGS).length
  const tableCount = Object.keys(TABLE_IDENTIFIER_MAPPINGS).length

  const validation = validateIdentifierLengths()

  return `
Database Identifier Optimization Summary
========================================

Total Changes:
- Enum renames: ${enumCount}
- Table renames: ${tableCount}
- Total operations: ${enumCount + tableCount}

Compliance Status: ${validation.compliant ? 'COMPLIANT' : 'VIOLATIONS FOUND'}

${
  validation.violations.length > 0
    ? `
Violations:
${validation.violations.map((v) => `- ${v.identifier} (${v.length} chars, ${v.type})`).join('\n')}
`
    : ''
}

Sample Changes:
- enum_pages_blocks_hero_code_snippet_language → enum_pages_hero_code_lang
- enum_pages_blocks_tech_stack_technologies_category → enum_pages_tech_cat
- pages_blocks_services_grid_services_features → pages_svc_grid_svc_feat
- pages_blocks_project_showcase_projects_technologies → pages_proj_show_proj_tech

All new identifiers maintain semantic meaning while staying under PostgreSQL's 63-character limit.
`
}
