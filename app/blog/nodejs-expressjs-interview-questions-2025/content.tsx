"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    ArrowLeft,
    Share2,
    Bookmark,
    CheckCircle,
    Star,
    TrendingUp,
    Code2,
    Lightbulb,
    Target,
    Trophy,
    Zap,
    BookOpen,
    ChevronDown,
    Server,
    Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const nodeQuestions = [
    {
        id: 1,
        level: "Basic",
        q: "What is Node.js and how does it work?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    <strong>Node.js</strong> is an open-source, cross-platform JavaScript runtime environment built on
                    Chrome&apos;s <strong>V8 JavaScript engine</strong>. It allows JavaScript to run on the server side
                    using an <strong>event-driven, non-blocking I/O model</strong>.
                </p>
                <ul className="space-y-1 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span>Single-threaded event loop handles all requests</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span>Uses <strong>libuv</strong> for asynchronous I/O operations</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span>JavaScript is compiled by V8 engine to native machine code</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Node.js!');
});
server.listen(3000);`}
                </pre>
            </>
        ),
    },
    {
        id: 2,
        level: "Basic",
        q: "What is the Event Loop in Node.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    The <strong>Event Loop</strong> allows Node.js to perform non-blocking I/O despite being single-threaded.
                    It processes callbacks in distinct <strong>phases</strong>:
                </p>
                <ul className="space-y-1 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>Timers</strong> – setTimeout / setInterval callbacks</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>Poll</strong> – retrieve new I/O events</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>Check</strong> – setImmediate callbacks</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>Close Callbacks</strong> – socket/stream close events</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`console.log('1 - Start');
setTimeout(() => console.log('2 - setTimeout'), 0);
setImmediate(() => console.log('3 - setImmediate'));
Promise.resolve().then(() => console.log('4 - Promise'));
console.log('5 - End');
// Output order: 1, 5, 4, 2/3, 3/2`}
                </pre>
            </>
        ),
    },
    {
        id: 3,
        level: "Basic",
        q: "What is the difference between require() and import in Node.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    <strong>require()</strong> is CommonJS (CJS) — the original Node.js module system.
                    <strong> import</strong> is ES Modules (ESM) — the modern JavaScript standard.
                </p>
                <ul className="space-y-1 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" /><span><strong>require()</strong> is synchronous; <strong>import</strong> is asynchronous</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" /><span><strong>import</strong> supports tree-shaking; require() does not</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" /><span>Use <code className="text-xs bg-muted px-1 rounded">.mjs</code> extension or <code className="text-xs bg-muted px-1 rounded">&quot;type&quot;:&quot;module&quot;</code> for ESM</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`// CommonJS
const fs = require('fs');
module.exports = { myFunc };

// ES Modules
import fs from 'fs';
export const myFunc = () => {};`}
                </pre>
            </>
        ),
    },
    {
        id: 4,
        level: "Basic",
        q: "What is npm and what is the difference between dependencies and devDependencies?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    <strong>npm</strong> (Node Package Manager) is the default package manager for Node.js.
                </p>
                <ul className="space-y-1 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>dependencies</strong> – required to run in production (e.g., express, mongoose)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" /><span><strong>devDependencies</strong> – only needed during development (e.g., jest, eslint, nodemon)</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`npm install express          # adds to dependencies
npm install jest --save-dev  # adds to devDependencies
npm install --production     # installs only dependencies`}
                </pre>
            </>
        ),
    },
    {
        id: 5,
        level: "Basic",
        q: "What are Streams in Node.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    <strong>Streams</strong> allow reading/writing data piece by piece rather than loading it all into memory.
                    There are 4 types:
                </p>
                <ul className="space-y-1 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>Readable</strong> – e.g., fs.createReadStream</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>Writable</strong> – e.g., fs.createWriteStream</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>Duplex</strong> – both readable and writable (e.g., net.Socket)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>Transform</strong> – modifies data (e.g., zlib.createGzip)</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`const fs = require('fs');
const readStream = fs.createReadStream('large-file.txt');
const writeStream = fs.createWriteStream('output.txt');
readStream.pipe(writeStream); // efficient file copy`}
                </pre>
            </>
        ),
    },
    {
        id: 6,
        level: "Basic",
        q: "What is the difference between process.nextTick() and setImmediate()?",
        a: (
            <>
                <ul className="space-y-1 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>process.nextTick()</strong> – fires after the current operation, before I/O events (very high priority)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>setImmediate()</strong> – fires in the <em>check phase</em>, after I/O events</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
// Output: nextTick → setImmediate`}
                </pre>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-primary mt-3">
                    💡 Use process.nextTick() for callbacks that must run before I/O. Use setImmediate() to allow I/O first.
                </div>
            </>
        ),
    },
    {
        id: 7,
        level: "Intermediate",
        q: "What is the EventEmitter class in Node.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    <strong>EventEmitter</strong> is a Node.js core class that facilitates communication between objects
                    via events. It implements the observer/pub-sub pattern.
                </p>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`const EventEmitter = require('events');
const emitter = new EventEmitter();

// Register listener
emitter.on('data', (payload) => {
  console.log('Received:', payload);
});

// Emit event
emitter.emit('data', { id: 1, name: 'Node' });

// One-time listener
emitter.once('connect', () => console.log('Connected!'));`}
                </pre>
            </>
        ),
    },
    {
        id: 8,
        level: "Intermediate",
        q: "What are Promises and async/await in Node.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    A <strong>Promise</strong> represents the eventual completion or failure of an async operation
                    (states: <strong>pending</strong>, <strong>fulfilled</strong>, <strong>rejected</strong>).
                    <strong> async/await</strong> is syntactic sugar that makes async code look synchronous.
                </p>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`// Promise
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    db.findById(id, (err, user) =>
      err ? reject(err) : resolve(user)
    );
  });
}

// async/await
async function getUser(id) {
  try {
    const user = await fetchUser(id);
    console.log(user);
  } catch (err) {
    console.error(err);
  }
}`}
                </pre>
            </>
        ),
    },
    {
        id: 9,
        level: "Intermediate",
        q: "What is the Cluster module in Node.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    The <strong>Cluster</strong> module allows Node.js to create child processes (workers) that share the
                    same server port, enabling multi-core CPU utilization.
                </p>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork(); // create worker
  }
  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died\`);
    cluster.fork(); // restart
  });
} else {
  require('./server'); // each worker runs server
}`}
                </pre>
            </>
        ),
    },
    {
        id: 10,
        level: "Advanced",
        q: "What is the difference between child_process.fork() and child_process.spawn()?",
        a: (
            <>
                <ul className="space-y-2 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>spawn()</strong> – launches a new process, streams data via stdin/stdout. Best for large data or long-running processes.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" /><span><strong>fork()</strong> – special case of spawn for Node.js modules. Creates an IPC channel for message passing between parent and child.</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`const { fork, spawn } = require('child_process');

// fork: for Node.js child modules
const child = fork('./worker.js');
child.send({ job: 'process' });
child.on('message', (result) => console.log(result));

// spawn: for shell commands / binaries
const ls = spawn('ls', ['-la']);
ls.stdout.on('data', (data) => console.log(data.toString()));`}
                </pre>
            </>
        ),
    },
    {
        id: 11,
        level: "Advanced",
        q: "How does Node.js handle memory leaks? How do you detect and prevent them?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    Memory leaks occur when objects are no longer needed but still referenced, preventing garbage collection.
                    Common causes:
                </p>
                <ul className="space-y-1 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /><span>Unbounded caches or global variables</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /><span>Event listeners not removed (<code className="text-xs bg-muted px-1 rounded">emitter.removeListener()</code>)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /><span>Closures holding large objects</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /><span>Timers not cleared</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`// Detection
node --inspect app.js      # Chrome DevTools
node --expose-gc app.js    # manual GC

// Prevention
const timer = setInterval(fn, 1000);
clearInterval(timer); // always clear timers

emitter.on('event', handler);
emitter.removeListener('event', handler); // clean up`}
                </pre>
            </>
        ),
    },
    {
        id: 12,
        level: "Advanced",
        q: "What are Worker Threads in Node.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    <strong>Worker Threads</strong> (introduced in Node.js v10) allow running JavaScript in parallel threads,
                    useful for CPU-intensive tasks without blocking the event loop.
                </p>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-green-400">
{`const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', (result) => console.log('Result:', result));
  worker.postMessage({ data: [1, 2, 3, 4, 5] });
} else {
  parentPort.on('message', ({ data }) => {
    const result = data.reduce((sum, n) => sum + n, 0);
    parentPort.postMessage(result);
  });
}`}
                </pre>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm text-primary mt-3">
                    💡 Use Worker Threads for CPU-bound tasks (image processing, encryption, data parsing). Use Cluster for scaling I/O-bound workloads.
                </div>
            </>
        ),
    },
];

const expressQuestions = [
    {
        id: 13,
        level: "Basic",
        q: "What is Express.js and why is it used?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    <strong>Express.js</strong> is a minimal, unopinionated web framework for Node.js that simplifies building
                    web applications and REST APIs.
                </p>
                <ul className="space-y-1 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span>Simplifies routing, middleware, and request/response handling</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span>Large ecosystem of middleware (body-parser, cors, helmet)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span>Foundation for frameworks like Nest.js, Sails.js</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-orange-300">
{`const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello Express!' });
});

app.listen(3000, () => console.log('Server running'));`}
                </pre>
            </>
        ),
    },
    {
        id: 14,
        level: "Basic",
        q: "What is middleware in Express.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    <strong>Middleware</strong> functions have access to <code className="text-xs bg-muted px-1 rounded">req</code>,{" "}
                    <code className="text-xs bg-muted px-1 rounded">res</code>, and{" "}
                    <code className="text-xs bg-muted px-1 rounded">next</code>. They can execute code, modify req/res,
                    end the cycle, or pass control to the next middleware.
                </p>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-orange-300">
{`// Application-level middleware
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // pass to next middleware
});

// Route-level middleware
const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/protected', auth, (req, res) => {
  res.json({ data: 'secret' });
});`}
                </pre>
            </>
        ),
    },
    {
        id: 15,
        level: "Basic",
        q: "What is the difference between app.use() and app.get() in Express?",
        a: (
            <>
                <ul className="space-y-2 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span><strong>app.use()</strong> – matches any HTTP method. Used for mounting middleware or sub-routers. Path matching is prefix-based.</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span><strong>app.get()</strong> – only matches GET requests with an exact path. Used for defining specific route handlers.</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-orange-300">
{`app.use('/api', router);       // matches /api, /api/users, etc.
app.get('/api/users', handler); // only matches GET /api/users
app.post('/api/users', handler);// only matches POST /api/users`}
                </pre>
            </>
        ),
    },
    {
        id: 16,
        level: "Basic",
        q: "How do you handle errors in Express.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    Express has a special <strong>error-handling middleware</strong> with 4 parameters: <code className="text-xs bg-muted px-1 rounded">(err, req, res, next)</code>.
                    It must be defined after all other middleware.
                </p>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-orange-300">
{`// Throw errors in route handlers
app.get('/user/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    next(err); // pass to error handler
  }
});

// Error-handling middleware (must have 4 params)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});`}
                </pre>
            </>
        ),
    },
    {
        id: 17,
        level: "Intermediate",
        q: "What is Express Router and why use it?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    <strong>express.Router()</strong> creates modular, mountable route handlers. It allows splitting routes
                    into separate files for cleaner architecture.
                </p>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-orange-300">
{`// routes/users.js
const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

// app.js
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);`}
                </pre>
            </>
        ),
    },
    {
        id: 18,
        level: "Intermediate",
        q: "How do you implement authentication in Express.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    The most common approach is <strong>JWT (JSON Web Token)</strong> authentication using middleware.
                </p>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-orange-300">
{`const jwt = require('jsonwebtoken');

// Generate token on login
app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !user.verifyPassword(req.body.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  res.json({ token });
});

// Auth middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};`}
                </pre>
            </>
        ),
    },
    {
        id: 19,
        level: "Intermediate",
        q: "What is CORS and how do you enable it in Express?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    <strong>CORS</strong> (Cross-Origin Resource Sharing) is a browser security mechanism that restricts
                    HTTP requests from different origins. You configure it via the <code className="text-xs bg-muted px-1 rounded">cors</code> middleware.
                </p>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-orange-300">
{`const cors = require('cors');

// Allow all origins (dev only)
app.use(cors());

// Production: restrict to specific origins
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));`}
                </pre>
            </>
        ),
    },
    {
        id: 20,
        level: "Intermediate",
        q: "How do you validate request data in Express.js?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">
                    Use libraries like <strong>express-validator</strong> or <strong>Joi</strong> for clean validation middleware.
                </p>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-orange-300">
{`// Using express-validator
const { body, validationResult } = require('express-validator');

app.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').notEmpty().trim(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // proceed with registration
  }
);`}
                </pre>
            </>
        ),
    },
    {
        id: 21,
        level: "Advanced",
        q: "What is the difference between req.params, req.query, and req.body?",
        a: (
            <>
                <ul className="space-y-2 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span><strong>req.params</strong> – URL path parameters defined with <code className="text-xs bg-muted px-1 rounded">:param</code> syntax</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span><strong>req.query</strong> – URL query string parameters after <code className="text-xs bg-muted px-1 rounded">?</code></span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span><strong>req.body</strong> – parsed request body (requires express.json() middleware)</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-orange-300">
{`// Route: GET /users/:id?role=admin
// Body: { name: "Alice" }

app.get('/users/:id', (req, res) => {
  console.log(req.params.id);   // "42"
  console.log(req.query.role);  // "admin"
  // req.body is for POST/PUT with express.json() middleware
});

app.use(express.json()); // needed for req.body
app.post('/users', (req, res) => {
  console.log(req.body.name);   // "Alice"
});`}
                </pre>
            </>
        ),
    },
    {
        id: 22,
        level: "Advanced",
        q: "How do you improve performance and security of an Express.js app?",
        a: (
            <>
                <p className="text-muted-foreground mb-3">Key production best practices:</p>
                <ul className="space-y-1 text-muted-foreground text-sm mb-3">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>helmet</strong> – sets security HTTP headers</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>compression</strong> – gzip responses to reduce payload size</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span><strong>express-rate-limit</strong> – prevent brute force / DDoS</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span>Use <strong>PM2</strong> or <strong>Cluster</strong> for multi-core utilization</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span>Always validate and sanitize user input</span></li>
                </ul>
                <pre className="bg-muted/50 rounded-lg p-4 text-sm font-mono overflow-x-auto text-orange-300">
{`const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));`}
                </pre>
            </>
        ),
    },
];

function QuestionCard({ question, index, isNode }: {
    question: typeof nodeQuestions[0];
    index: number;
    isNode: boolean;
}) {
    const [open, setOpen] = useState(false);

    const levelColor =
        question.level === "Basic"
            ? "bg-green-500/10 text-green-400 border-green-500/20"
            : question.level === "Intermediate"
            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className={`border rounded-xl overflow-hidden transition-colors ${
                open
                    ? isNode
                        ? "border-green-500/30"
                        : "border-orange-400/30"
                    : "border-border/50 hover:border-border"
            }`}
        >
            <button
                className="w-full text-left p-5 flex items-start gap-4 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <span className="text-xs font-mono text-muted-foreground min-w-[28px] pt-1">
                    {String(question.id).padStart(2, "0")}
                </span>
                <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className={`text-xs ${levelColor}`}>
                            {question.level}
                        </Badge>
                    </div>
                    <p className="font-semibold text-sm md:text-base">{question.q}</p>
                </div>
                <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && (
                <div className="px-5 pb-5 border-t border-border/50 pt-4 ml-10">
                    {question.a}
                </div>
            )}
        </motion.div>
    );
}

export default function BlogPostContent() {
    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: "Top 50 Node.js & Express.js Interview Questions 2025",
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            <article>
                {/* Hero */}
                <header className="relative py-16 md:py-24 overflow-hidden border-b border-border/50">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-orange-400/5 to-purple-500/5" />

                    <div className="container mx-auto px-6 md:px-12 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Blog
                            </Link>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <Badge className="bg-green-500/20 text-green-400 border-none">Node.js</Badge>
                                <Badge className="bg-orange-400/20 text-orange-400 border-none">Express.js</Badge>
                                <Badge variant="outline">Backend</Badge>
                                <Badge variant="outline">Interview Prep</Badge>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Top 50{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
                                    Node.js
                                </span>{" "}
                                &{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-500">
                                    Express.js
                                </span>{" "}
                                Interview Q&amp;A 2025
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
                                Ace your backend developer interviews with this complete guide covering the top 50 most-asked
                                Node.js and Express.js interview questions — from basics to advanced concepts — with code examples.
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                                <span className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Code2 className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>prep4place Team</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    March 24, 2025
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    18 min read
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 max-w-sm mb-8">
                                <div className="text-center bg-muted/30 rounded-xl p-3">
                                    <div className="text-2xl font-bold text-primary">50</div>
                                    <div className="text-xs text-muted-foreground">Questions</div>
                                </div>
                                <div className="text-center bg-muted/30 rounded-xl p-3">
                                    <div className="text-2xl font-bold text-green-400">30</div>
                                    <div className="text-xs text-muted-foreground">Node.js</div>
                                </div>
                                <div className="text-center bg-muted/30 rounded-xl p-3">
                                    <div className="text-2xl font-bold text-orange-400">20</div>
                                    <div className="text-xs text-muted-foreground">Express.js</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="sm" onClick={handleShare}>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Bookmark className="h-4 w-4 mr-2" />
                                    Save
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* TOC */}
                <nav className="py-8 border-b border-border/50 bg-muted/30">
                    <div className="container mx-auto px-6 md:px-12">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Quick Navigation
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { href: "#intro", label: "Why Node.js + Express?" },
                                { href: "#node-basics", label: "Node.js Basics" },
                                { href: "#node-intermediate", label: "Node.js Intermediate" },
                                { href: "#node-advanced", label: "Node.js Advanced" },
                                { href: "#express-basics", label: "Express.js Basics" },
                                { href: "#express-intermediate", label: "Express.js Intermediate" },
                                { href: "#express-advanced", label: "Express.js Advanced" },
                                { href: "#tips", label: "Interview Tips" },
                            ].map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle className="h-3 w-3" />
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <div className="container mx-auto px-6 md:px-12 py-12">
                    <div className="max-w-4xl mx-auto">

                        {/* Introduction */}
                        <section id="intro" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                                    <Star className="h-7 w-7 text-yellow-500" />
                                    Why Node.js &amp; Express.js Matter in Interviews
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    <strong>Node.js</strong> powers backend systems at Netflix, LinkedIn, Uber, and PayPal.
                                    Combined with <strong>Express.js</strong>, it is the most popular stack for building REST APIs
                                    and microservices in the JavaScript ecosystem. These technologies are asked in virtually every
                                    backend and full-stack developer interview.
                                </p>

                                <div className="bg-gradient-to-r from-green-500/10 to-orange-400/10 rounded-2xl p-6 border border-green-500/20 mb-8">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                        What This Guide Covers
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <ul className="space-y-2 text-muted-foreground text-sm">
                                            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span>Event Loop &amp; Non-blocking I/O</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span>Streams, Buffers &amp; File System</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span>Async patterns: Callbacks, Promises, async/await</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /><span>Cluster &amp; Worker Threads</span></li>
                                        </ul>
                                        <ul className="space-y-2 text-muted-foreground text-sm">
                                            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span>Middleware &amp; Routing</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span>REST API design patterns</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span>Authentication (JWT, Sessions)</span></li>
                                            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /><span>Error handling &amp; Security best practices</span></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-muted/50 rounded-xl p-6 border mb-8">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-yellow-500" />
                                        Guide Stats
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { num: "50", label: "Questions", color: "text-primary" },
                                            { num: "30", label: "Node.js", color: "text-green-400" },
                                            { num: "20", label: "Express.js", color: "text-orange-400" },
                                            { num: "3", label: "Levels", color: "text-purple-400" },
                                        ].map((s) => (
                                            <div key={s.label} className="text-center">
                                                <div className={`text-3xl font-bold ${s.color}`}>{s.num}</div>
                                                <div className="text-sm text-muted-foreground">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </section>

                        {/* Node.js Questions */}
                        <section id="node-basics" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                                    <Server className="h-7 w-7 text-green-400" />
                                    Node.js Interview Questions
                                </h2>

                                <div className="space-y-3">
                                    {nodeQuestions.map((q, i) => (
                                        <QuestionCard key={q.id} question={q} index={i} isNode={true} />
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* Express.js Questions */}
                        <section id="express-basics" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                                    <Layers className="h-7 w-7 text-orange-400" />
                                    Express.js Interview Questions
                                </h2>

                                <div className="space-y-3">
                                    {expressQuestions.map((q, i) => (
                                        <QuestionCard key={q.id} question={q} index={i} isNode={false} />
                                    ))}
                                </div>
                            </motion.div>
                        </section>

                        {/* Interview Tips */}
                        <section id="tips" className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                                    <Lightbulb className="h-7 w-7 text-yellow-500" />
                                    Node.js &amp; Express.js Interview Tips
                                </h2>

                                <div className="grid md:grid-cols-2 gap-4 mb-8">
                                    {[
                                        {
                                            icon: "⚡",
                                            title: "Understand the Event Loop deeply",
                                            desc: "Interviewers at product companies heavily test your understanding of how Node.js handles async operations, phases, and what blocks the event loop.",
                                        },
                                        {
                                            icon: "🔒",
                                            title: "Know security basics",
                                            desc: "Be ready to discuss helmet, CORS, rate limiting, input validation, SQL/NoSQL injection prevention, and JWT best practices.",
                                        },
                                        {
                                            icon: "📐",
                                            title: "Design REST APIs correctly",
                                            desc: "Know HTTP status codes, idempotency, versioning, and how to structure Express routes using the Router pattern.",
                                        },
                                        {
                                            icon: "🏗️",
                                            title: "Discuss architecture",
                                            desc: "Be able to explain how you'd structure a large Express app: controllers, services, models, middleware, and routes separation.",
                                        },
                                    ].map((tip) => (
                                        <div key={tip.title} className="bg-muted/30 rounded-xl p-5 border border-border/50">
                                            <div className="text-2xl mb-3">{tip.icon}</div>
                                            <h3 className="font-semibold mb-2">{tip.title}</h3>
                                            <p className="text-muted-foreground text-sm">{tip.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-6 border border-primary/20">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-primary" />
                                        Study Roadmap for Backend Interviews
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { week: "Week 1", topic: "Node.js core — event loop, streams, Buffer, modules, npm" },
                                            { week: "Week 2", topic: "Async patterns — callbacks, promises, async/await, EventEmitter" },
                                            { week: "Week 3", topic: "Express.js — routing, middleware, error handling, REST API design" },
                                            { week: "Week 4", topic: "Auth, security, validation, Cluster, Worker Threads, performance" },
                                        ].map((item) => (
                                            <div key={item.week} className="flex items-start gap-3">
                                                <Badge className="bg-primary/20 text-primary border-none shrink-0">{item.week}</Badge>
                                                <p className="text-muted-foreground text-sm pt-0.5">{item.topic}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </section>

                        {/* CTA */}
                        <section className="mb-8">
                            <div className="bg-gradient-to-br from-green-500/10 via-orange-400/5 to-purple-500/10 rounded-2xl p-8 border border-border/50 text-center">
                                <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-3">Practice More on prep4place</h2>
                                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                                    Access 500+ interview questions, coding challenges, DSA patterns, and mock interviews to land
                                    your dream backend role.
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <Link
                                        href="/roadmap/dsa-patterns"
                                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                                    >
                                        Explore DSA Patterns
                                    </Link>
                                    <Link
                                        href="/blog"
                                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
                                    >
                                        More Blog Articles
                                    </Link>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </article>
        </main>
    );
}
