import express from 'express';
import multer from 'multer';

// Website - Pages & Resources
import getResource from '../handlers/site/resources.js';
import getPage from '../handlers/site/pages.js';
import stats from '../handlers/site/stats.js';

// Website - Users
import signUp from '../handlers/site/users/signup.js';
import signIn from '../handlers/site/users/signin.js';

// Website - Administrative
import grantAPIAccess from '../handlers/site/administrative/grantAPIAccess.js';

// Files
import allFiles from '../handlers/files/all.js';
import getFile from '../handlers/files/get.js';
import deleteFile from '../handlers/files/delete.js';
import postFile from '../handlers/files/post.js';

// Links
import allLinks from '../handlers/links/all.js';
import getLink from '../handlers/links/get.js';
import deleteLink from '../handlers/links/delete.js';
import postLink from '../handlers/links/post.js';

// 404
function handleError(req, res) {
  res.status(404).json({ message: 'Requested route does not exist. ' });
}

const upload = multer();
const router = express.Router();

// Website - Pages & Resources
router.get('/resources/:folder/:file', getResource);
router.get('/:page?', getPage);
router.get('/api/stats', stats);

// Website - Users
router.post('/api/signup', upload.none(), signUp);
router.post('/api/signin', upload.none(), signIn);

// Website - Administrative
router.post('/api/grant-api-access', upload.none(), grantAPIAccess);

// Files
// API
router.get('/api/all-files', allFiles);
router.post('/api/files', upload.single('file'), postFile);
router.delete('/api/files/:file', deleteFile);

// Actual File
router.get('/f/:file', getFile);

// Links
// API
router.get('/api/all-links', allLinks);
router.post('/api/links', upload.none(), postLink);
router.delete('/api/links/:link', deleteLink);

// Actual Link
router.get('/l/:link', getLink);

// Unhandled Requests
router.get('*', handleError);

export default router;
