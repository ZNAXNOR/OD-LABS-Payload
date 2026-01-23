/**
 * Type extensions for Payload CMS to support database identifier optimization
 *
 * This file extends Payload CMS types to include the `dbName` property
 * for database identifier length optimization as specified in the
 * database-identifier-optimization specification.
 */

import type {
  Field,
  GlobalConfig,
  CollectionConfig,
  Tab,
  GroupField,
  ArrayField,
  BlocksField,
  TabsField,
  RowField,
  CollapsibleField,
  TextField,
  TextareaField,
  EmailField,
  NumberField,
  DateField,
  CheckboxField,
  SelectField,
  RadioField,
  RelationshipField,
  UploadField,
  RichTextField,
  PointField,
  JSONField,
  CodeField,
  UIField,
  JoinField,
} from 'payload'

declare module 'payload' {
  // Extend base field types to include dbName property
  interface BaseFieldExtension {
    /**
     * Custom database name for this field to override auto-generated names.
     * Used to prevent PostgreSQL identifier length violations (63 character limit).
     * Should use snake_case format and meaningful abbreviations.
     */
    dbName?: string
  }

  // Extend all field types
  interface TextField extends BaseFieldExtension {}
  interface TextareaField extends BaseFieldExtension {}
  interface EmailField extends BaseFieldExtension {}
  interface NumberField extends BaseFieldExtension {}
  interface DateField extends BaseFieldExtension {}
  interface CheckboxField extends BaseFieldExtension {}
  interface SelectField extends BaseFieldExtension {}
  interface RadioField extends BaseFieldExtension {}
  interface RelationshipField extends BaseFieldExtension {}
  interface UploadField extends BaseFieldExtension {}
  interface RichTextField extends BaseFieldExtension {}
  interface PointField extends BaseFieldExtension {}
  interface JSONField extends BaseFieldExtension {}
  interface CodeField extends BaseFieldExtension {}
  interface UIField extends BaseFieldExtension {}
  interface JoinField extends BaseFieldExtension {}

  // Extend container field types
  interface GroupField extends BaseFieldExtension {}
  interface ArrayField extends BaseFieldExtension {}
  interface BlocksField extends BaseFieldExtension {}
  interface TabsField extends BaseFieldExtension {}
  interface RowField extends BaseFieldExtension {}
  interface CollapsibleField extends BaseFieldExtension {}

  // Extend tab types
  interface NamedTab extends BaseFieldExtension {}
  interface UnnamedTab {
    /**
     * Custom database name for this tab to override auto-generated names.
     * Used to prevent PostgreSQL identifier length violations (63 character limit).
     * Should use snake_case format and meaningful abbreviations.
     */
    dbName?: string
  }

  // Extend global and collection configs
  interface GlobalConfig {
    /**
     * Custom database name for this global to override auto-generated names.
     * Used to prevent PostgreSQL identifier length violations (63 character limit).
     * Should use snake_case format and meaningful abbreviations.
     */
    dbName?: string
  }

  interface CollectionConfig {
    /**
     * Custom database name for this collection to override auto-generated names.
     * Used to prevent PostgreSQL identifier length violations (63 character limit).
     * Should use snake_case format and meaningful abbreviations.
     */
    dbName?: string
  }

  // Extend block types
  interface Block {
    /**
     * Custom database name for this block to override auto-generated names.
     * Used to prevent PostgreSQL identifier length violations (63 character limit).
     * Should use snake_case format and meaningful abbreviations.
     */
    dbName?: string
  }
}
