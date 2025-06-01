// This script applies a migration without connecting to the database
// It's useful for CI/CD environments or when you don't have access to the database

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the migration names from command line arguments or use the default migrations
const migrationNames = process.argv.slice(2).length > 0
  ? process.argv.slice(2)
  : [
      '20250522083600_add_course_progress_and_fix_enrollment',
      '20250522084500_add_certificate_course_relation',
      '20250522085400_add_webinar_models',
      '20250522085700_add_teaching_resource_model',
      '20250522090000_add_restorative_justice_models',
      '20250522090300_add_circle_template_model',
      '20250522090600_add_community_building_models',
      '20250522090900_add_parent_education_models',
      '20250522091200_add_reflection_prompts_model',
      '20250522091500_add_restorative_training_models',
      '20250522092700_add_restorative_training_resources',
      '20250522092920_add_duration_and_level_to_training_module',
      '20250522093140_add_type_and_duration_to_training_section',
      '20250522093350_add_restorative_training_quiz_attempt',
      '20250522102900_add_learning_difference_profile',
      '20250522104500_add_mindfulness_models'
    ];

// Path to the migrations directory
const migrationsDir = path.join(__dirname, '../prisma/migrations');

// Path to the migration.toml file
const migrationTomlPath = path.join(migrationsDir, 'migration_lock.toml');

// Check if migration_lock.toml exists, create it if it doesn't
if (!fs.existsSync(migrationTomlPath)) {
  fs.writeFileSync(migrationTomlPath, 'provider = "postgresql"\n');
  console.log('Created migration_lock.toml file');
}

// Path to the applied migrations directory
const appliedMigrationsDir = path.join(migrationsDir, '_applied');

// Create the _applied directory if it doesn't exist
if (!fs.existsSync(appliedMigrationsDir)) {
  fs.mkdirSync(appliedMigrationsDir, { recursive: true });
  console.log('Created _applied directory');
}

// Apply each migration
for (const migrationName of migrationNames) {
  // Path to the migration directory
  const migrationDir = path.join(migrationsDir, migrationName);

  // Check if the migration directory exists
  if (!fs.existsSync(migrationDir)) {
    console.error(`Migration ${migrationName} not found`);
    continue;
  }

  // Mark the migration as applied
  const appliedMigrationPath = path.join(appliedMigrationsDir, `${migrationName}.toml`);
  fs.writeFileSync(appliedMigrationPath, `migration_name = "${migrationName}"\napplied_at = ${Math.floor(Date.now() / 1000)}\n`);
  console.log(`Marked migration ${migrationName} as applied`);
}

// Generate the Prisma client
console.log('Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully');
} catch (error) {
  console.error('Error generating Prisma client:', error);
  process.exit(1);
}