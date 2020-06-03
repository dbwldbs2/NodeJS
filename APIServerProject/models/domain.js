module.exports = (sequelize, DataTypes) => {
    return sequelize.define('domain', {
        host: {
            type: DataTypes.STRING(80),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        clientSecret: {
            type: DataTypes.STRING(40),
            allowNull: false
        }
    }, {
        validate: {
            unKnownType() {
                console.log('unKnownType :: ', this.type, this.type !== 'free', this.type !== 'premium');
                if(this.type !== 'free', this.type !== 'premium') {
                    throw new Error('type 컬럼은 free나 primium이여야 합니다.');
                }
            }
        },
        timestamp: true,
        paranoid: true
    });
};