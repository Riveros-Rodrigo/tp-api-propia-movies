module.exports = (sequelize, dataTypes) => {
    let alias = 'Actor_Movie';
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        movie_id: {
            type: dataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        actor_id: {
            type: dataTypes.INTEGER.UNSIGNED,
            allowNull: false
        }
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
        tableName: 'actor_movie'
    }
    const Actor_Movie = sequelize.define(alias, cols, config); 

    return Actor_Movie
};