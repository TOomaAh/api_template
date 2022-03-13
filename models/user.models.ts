import { Model, DataTypes } from 'https://deno.land/x/denodb/mod.ts';
import db from '../config/db.config.ts';

class User extends Model {
  static table = 'users';
  static timestamps = false;
  static fields = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
  };

}

db.link([User]);

export default User;