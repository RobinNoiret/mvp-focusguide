import Database from '@adonisjs/lucid/database'
import env from '#start/env'

async function fixMigration() {
  const database = new Database(
    {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        ssl: env.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      },
    },
    {}
  )

  try {
    // Vérifier les migrations enregistrées
    const existing = await database.from('adonis_schema').where('migration_name', 'like', '%1743667200000%').orWhere('migration_name', 'like', '%1768164822936%')

    console.log('Migrations trouvées:', existing)

    // Si l'ancienne migration existe, la renommer
    if (existing.some((m) => m.migration_name.includes('1743667200000'))) {
      await database
        .from('adonis_schema')
        .where('migration_name', 'like', '%1743667200000%')
        .update({ migration_name: 'database/migrations/1768164822936_add_fl_onboarding_to_users' })

      console.log('✓ Migration mise à jour avec succès')
    } else if (existing.some((m) => m.migration_name.includes('1768164822936'))) {
      console.log('✓ La migration a déjà le bon timestamp')
    } else {
      console.log('⚠️ Aucune migration trouvée. Vérifiez la table adonis_schema')
    }
  } catch (error) {
    console.error('Erreur:', error.message)
  } finally {
    await database.close()
  }
}

fixMigration()
