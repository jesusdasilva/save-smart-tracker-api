import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '../db';
import { users } from '../types/users.schema';
import { eq } from 'drizzle-orm';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Buscar usuario existente con google_id
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.google_id, profile.id))
      .limit(1);

    if (existingUser.length > 0) {
      // Usuario existente
      return done(null, existingUser[0]);
    }

    // Buscar por email para vincular cuentas
    const emailUser = await db.select()
      .from(users)
      .where(eq(users.email, profile.emails?.[0]?.value || ''))
      .limit(1);

    if (emailUser.length > 0) {
      // Actualizar usuario existente con datos de Google
      const updated = await db.update(users)
        .set({
          google_id: profile.id,
          avatar_url: profile.photos?.[0]?.value,
          provider: 'google'
        })
        .where(eq(users.id, emailUser[0].id));
      
      return done(null, emailUser[0]);
    }

    // Crear nuevo usuario
    const newUser = await db.insert(users).values({
      username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || 'user',
      email: profile.emails?.[0]?.value,
      google_id: profile.id,
      avatar_url: profile.photos?.[0]?.value,
      provider: 'google'
    });

    const createdUser = await db.select()
      .from(users)
      .where(eq(users.google_id, profile.id))
      .limit(1);

    return done(null, createdUser[0]);
  } catch (error) {
    return done(error, undefined);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    done(null, user[0] || null);
  } catch (error) {
    done(error, undefined);
  }
});

export default passport;
