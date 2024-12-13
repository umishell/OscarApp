import fastify from 'fastify';
import fp from '@fastify/postgres';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import fastifyHttps from 'fastify-https';


const fast = fastify();
const secret = process.env.SECRET_KEY; 
const noAuthRoutes = ['/health','/login','/filmes','/diretores'];


fast.register(fp, {
  connectionString: process.env.DATABASE_URL,
});

fastify.register(fastifyHttps, {
  allowUntrusted: process.env.NODE_ENV === 'development', // Allow for development only
  certPath: 'path/to/your/server.crt',
  keyPath: 'path/to/your/server.key'
});

// global error handler
fast.setErrorHandler((error, request, reply) => {
  console.error(error);
  reply.code(500).send({ error: 'Internal Server Error' });
});


//// ASYNC FUNTIONS



async function processVote(userId, movieId, directorId){
  try {
    const result = await fast.pg.query('INSERT INTO votos (usuario_id, filme_id, diretor_id) VALUES ($1, $2, $3)', [userId, movieId, directorId]);

    if (result.rowCount === 0) {
      throw new Error('Failed to cast vote');
    }
    return true;
  } catch (error) {
    throw error;
  }
}


//// ROUTES

fast.get('/health', async (request, reply) => {
  reply.send({ status: 'SERVER RUNNING' });
});



fast.post('/login', async (request, reply) => {
  try {
    const { username, password } = request.body; 
    const { rows } = await fast.pg.query('SELECT * FROM oscar.usuarios WHERE username = $1', [username]);

    if (!rows || rows.length === 0) {
      throw new Error('Invalid username or password');
    }
    const user = rows[0];
    if (!user || user.password !== password) {
      throw new Error('Invalid username or password');
    }

    // Generate TOKEN
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '12h' });
    //const token = jwt.sign({ userId: 333333 }, secret, { expiresIn: '1h' });

    const result = await fast.pg.query('INSERT INTO oscar.tokens (token, usuario_id) VALUES ($1, $2) RETURNING issued_at', [token, user.id]);
    const issuedAt = result.rows[0].issued_at;
    const id = user.id;
    reply.send({ id, token, issuedAt });
    
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Problem logging in' });
  }
});



fast.get('/filmes', async (request, reply) => {
  try {
    const { rows } = await fast.pg.query('SELECT * FROM oscar.filmes');
    reply.send(rows);
  } catch (error) {
    console.error('Error executing query:', error.message);
    reply.code(500).send({ error: 'Problem getting movies data' });
  }
});



fast.get('/diretores', async (request, reply) => {
  try {
    const { rows } = await fast.pg.query('SELECT * FROM oscar.diretores');
    reply.send(rows);
  } catch (error) {
    console.error('Error executing query:', error.message);
    reply.code(500).send({ error: 'Problem getting directors data' });
  }
});


async function authenticate(request, reply) {
  if (noAuthRoutes.includes(request.url)) {
    return; // Skip authentication for noAuthRoutes
  }

  try {

    const token = request.headers.authorization;
    const token1 = jwt.sign({ userId: 1 }, secret, { expiresIn: '1h' });
    //const token2 = jwt.sign({ userId: 1 }, secret, { expiresIn: '1h' });
    
reply.send(token);
    const decoded = await jwt.verify(token, secret);
    reply.send(decoded);
    
    // Check if the token has expired
    if (decoded.exp < Date.now() / 1000) {
      throw new Error('Token has expired');
    }

    request.body.userId = decoded.userId;

  } catch (error) {
    console.error(error);
    reply.code(401).send({ error: 'Unauthorized' });
  }
};
fast.addHook('preHandler', authenticate);

fast.post('/vote', async (request, reply) => {
  try {
      const userId = request.body.userId;
      const token = request.body.token;
      const movieId = request.body.movieId;
      const directorId = request.body.directorId;
reply.send(userId, token, movieId, directorId);
      processVote(userId, movieId, directorId)
        .then(() => {
          reply.send({ message: 'Vote successfully cast' });
        })
        .catch((error) => {
          console.error(error);
          reply.code(500).send({ error: 'Failed to cast vote' });
        });
    
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Problem casting vote' });
  }
});



// ... (outras rotas)



fast.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fast.log.error(err);
    process.exit(1);
  }
  fast.log.info(`server listening on ${address}`);
});


