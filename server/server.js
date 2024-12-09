//ANDROID APP SERVER

import fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const fast = fastify();


const secret = process.env.SECRET_KEY; 


// Add a global error handler
fast.setErrorHandler((error, request, reply) => {
  console.error(error);
  reply.code(500).send({ error: 'Internal Server Error' });
});


fast.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL,
}); 






const authenticate = async (request, reply) => {
  try {
    const token = request.headers.authorization;
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        throw new Error('Invalid token');
      }
    });
  } catch (error) {
    console.error(error);
    reply.code(401).send({ error: 'Unauthorized' });
  }
};

fast.addHook('preHandler', authenticate);

async function processVote(userId, movieId, directorId) {
  try {
    const client = await fast.pg.connect();
    const result = await client.query('INSERT INTO votos (usuario_id, filme_id, diretor_id) VALUES ($1, $2, $3)', [userId, movieId, directorId]);

    if (result.rowCount === 0) {
      throw new Error('Failed to cast vote');
    }

    // Additional logic to handle the vote, such as updating the vote count
    // ...

    return true;
  } catch (error) {
    throw error;
  }
}


//// ROUTES

fast.get('/health', async (request, reply) => {
  reply.send({ status: 'OK' });
});

fast.post('/login', async (request, reply) => {
  try {
    const { username, password } = request.body;

    // Verify the user's credentials
    const client = await fast.pg.connect();
    const { rows } = await client.query('SELECT * FROM usuarios WHERE username = $1', [username]);

    if (!rows || rows.length === 0) {
      throw new Error('Invalid username or password');
    }

    const user = rows[0];

    if (!user || user.password !== password) {
      throw new Error('Invalid username or password');
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });

    reply.send({ token });
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Internal Server Error' });
  } finally {
    // Release the connection back to the pool (important)
    await client.release();
  }
});



fast.post('/vote', async (request, reply) => {
  try {
    const token = request.headers.authorization;

    // Verify the JWT token

    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        throw new Error('Invalid token');
      }

      const userId = decoded.userId;
      const movieId = request.body.movieId;
      const directorId = request.body.directorId;

      // Process the vote
      processVote(userId, movieId, directorId)
        .then(() => {
          reply.send({ message: 'Vote successfully cast' });
        })
        .catch((error) => {
          console.error(error);
          reply.code(500).send({ error: 'Failed to cast vote' });
        });
    });
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Internal Server Error' });
  }
});


fast.get('/filmes', async (request, reply) => {
  const client = await fast.pg.connect(); // Use fast.pg to connect

  try {
    const { rows } = await client.query('SELECT * FROM filmes');
    reply.send(rows);

  } finally {
    await client.release();
  }
});

fast.get('/diretores', async (request, reply) => {
  const client = await fast.pg.connect(); // Use fast.pg to connect

  try {
    const { rows } = await client.query('SELECT * FROM diretores');
    reply.send(rows);

  } finally {
    await client.release();
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