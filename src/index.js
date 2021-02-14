const fs = require('fs');
const { google } = require('googleapis');
const { exec } = require('child-process-promise');
const { vars, oAuth2Client } = require('./config');

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

/**
 * * Dumps the current state of the database locally and compresses it
 * @returns {Promise<string>} Returns the path of the dumped database
 */
const dumpDatabaseLocally = async () => {
  const DB_DUMP_BASE = 'dumps';

  const dbDumpFolderName = `db_dump_${new Date().toISOString()}`;
  const dbDumpPath = `${DB_DUMP_BASE}/${dbDumpFolderName}`;
  await exec(`mongodump --uri=${vars.DB} --out ${dbDumpPath}`);

  const compressedFileName = `${new Date()
    .toDateString()
    .split(' ')
    .join('_')}.tar.gz`;
  await exec(`tar -zcvf ${compressedFileName} ${dbDumpPath}`);

  return compressedFileName;
};

/**
 * * Uploads the file to G Drive
 * @returns {Promise<string>} Returns the fileId
 */
const uploadToGDrive = async (fileName) => {
  const { G_DRIVE_BACKUP_FOLDER_ID } = vars;
  const uploadRes = await drive.files.create({
    resource: {
      name: fileName,
      parents: [G_DRIVE_BACKUP_FOLDER_ID],
    },
    media: {
      body: fs.createReadStream(fileName),
    },
  });
  return uploadRes.data.id;
};

(async () => {
  const dbDumpPath = await dumpDatabaseLocally();
  console.log(`Dumped database locally 📦`);
  const fileId = await uploadToGDrive(dbDumpPath);
  console.log(`Uploaded to G Drive (${fileId}) 🚀`);
})();
