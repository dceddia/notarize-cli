const execa = require('execa');

const getNotarizationInfo = async (requestUuid, appleId, teamId, password) => {
  const { stdout } = await execa('xcrun', [
    'notarytool',
    'log',
    '--apple-id',
    appleId,
    '--team-id',
    teamId,
    '--password',
    password,
    '--output-format',
    'json',
    requestUuid,
  ]);
  let notarizationInfo;
  try {
    notarizationInfo = JSON.parse(stdout);
  } catch (error) {
    console.error(stdout);
  }
  return notarizationInfo;
};

const notarizeApp = async (file, appleId, teamId, password) => {
  let failed;
  var xcrun_args = ['notarytool', 'submit'];
  xcrun_args.push('--wait');
  xcrun_args.push('--output-format', 'json');
  if (appleId !== undefined) {
    xcrun_args.push('--apple-id', appleId);
  }
  if (teamId !== undefined) {
    xcrun_args.push('--team-id', teamId);
  }
  if (password !== undefined) {
    xcrun_args.push('--password', password);
  }
  if (file !== undefined) {
    xcrun_args.push(file);
  }
  const { stdout } = await execa('xcrun', xcrun_args).catch((e) => { failed = true; return e });
  let requestUuid, requestStatus, error;
  try {
    if (failed) {
      error = JSON.parse(stdout)['message'];
    }
    else {
      requestUuid = JSON.parse(stdout)['id'];
      requestStatus = JSON.parse(stdout)['status'];
    }
  } catch (error) {
    console.error(stdout);
  }
  return { requestUuid, requestStatus, error };
};

const staple = async (file) => {
  const { stdout } = await execa('xcrun', ['stapler', 'staple', file]);
  return stdout;
};

module.exports = {
  getNotarizationInfo,
  notarizeApp,
  staple,
};
