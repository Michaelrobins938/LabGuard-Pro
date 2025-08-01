module.exports = (sequelize, DataTypes) => {
    const Character = sequelize.define('Character', {
        name: DataTypes.STRING,
        image_url: DataTypes.STRING,
        base_strength: DataTypes.INTEGER,
        base_agility: DataTypes.INTEGER,
        base_intelligence: DataTypes.INTEGER
    }, {});

    Character.associate = function(models) {
        // associations can be defined here
        Character.hasMany(models.UserCharacter, {
            foreignKey: 'characterId',
            as: 'userCharacters'
        });
    };

    return Character;
};
