const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    frist_name: {
        type: String,
        trim: true,
    },
    last_name: {
        type: String,
        trim: true,
    },
    user_name: {
        type: String,
        trim: true,
    },
    email : {
        type: String,
        trim: true,
        unique: 'Email already exists!',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required!'
    },
    created: {
        type: Date,
        default: Date.now   
    },
    updated: Date,
    hashed_password: {
        type: String,
        required: 'Password is required'
    },
    salt: String,
});

UserSchema
    .virtual('password')
    .set(function(password){
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function(){
        return this._password;
    })

UserSchema.methods = {
    makeSalt: function() {
        bcrypt.genSalt(10, (err, salt) =>{
        if(err) throw err;
        this.salt = salt;
    })},
    encryptPassword: (password) => {
        bcrypt.hash(password, this.salt, (err, hash) => {
            if(err) throw err;
            this.hashed_password = hash;
        });
    }
}

UserSchema.path('hashed_password').validate(function(v){
    if(this._password && this._password.length < 6){
        this.invalidate('password', 'Password must be at least 6 characters.');
    }
    if(this.isNew && !this._password) {
        this.invalidate('password', 'Password is required');
    }
})