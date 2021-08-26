module.exports = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.NODE_ENV === 'production' ? 'ubuntu' : 'postgres',
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: false,
	entities: ['dist/source/domain/entities/**/*{.js,.ts}'],
	migrations: ['dist/source/domain/migrations/**/*{.js,.ts}'],
	cli: {
		entitiesDir: 'dist/source/domain/entities',
		migrationsDir: 'dist/source/domain/migrations',
		subscribersDir: 'dist/source/domain/subscriber',
	},
};
