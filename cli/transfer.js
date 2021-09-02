const fs = require('fs');
const spawnSync = require('child_process').spawnSync;

/*
 * get_proc_output(image_name, args)
 *
 * takes an image name as a string and arguments as an array and returns its
 * stdout as a string. throws an exception with the contents of stderr if the
 * process writes to std_err
 */
function get_proc_output(image_name, args) {
  // spawn the process
  let proc = spawnSync(image_name, args);

  // check if the process actually spawned succesfully
  if (proc.stdout == null)
    throw Error('unable to spawn process with image name ' + image_name);

  // check if there was any stderr output
  let stderr_output = proc.stderr.toString().trim();
  if (stderr_output.length > 0) {
    // throw an error containing stderr
    throw Error(stderr_output);
  }

  // if there was no error output, return stdout as a string
  return proc.stdout.toString().trim();
}

function log_error(msg) {
  console.log('ERROR: ' + msg);
}
function log_info(msg) {
  console.log('INFO: ' + msg);
}

// check if prompt-sync is installed
try {
  var prompt = require('prompt-sync')();
} catch (e) {
  log_error(
    'it appears that prompt-sync is not installed. please install with "npm install prompt-sync"',
  );
  process.exit(-2);
}

// check for the correct amount of command line arguments
let keypair_filepath = null;
let batch_filepath = null;
if (process.argv.length != 4 || '-?' in process.argv) {
  // if the user specified invalid arguments or '-?', show usage
  if (process.argv.length != 2) {
    console.log('usage: ' + process.argv[1] + ' [keypair.json] [batch.csv]');
    console.log(
      '\n  - keypair.json must be a file containing your public/private keypair as an array of JSON integers.',
    );
    console.log(
      '  - batch.csv must be a CSV file containing entries of all the desired transfers in the format:',
    );
    console.log('\n      AMOUNT,SPL_TOKEN_ADDRESS,RECIPIENT_WALLET_ADDRESS\n');
    console.log(
      '    the first record in batch.csv will be ignored as it is assumed to be column info.\n',
    );
    process.exit(-1);
  } else {
    // if there were no arguments, get the keypair and batch files interactively
    keypair_filepath = prompt('input path of keypair JSON file: ');
    batch_filepath = prompt('input path of batch CSV file:    ');

    // check that the user didn't press Ctrl-C
    if (keypair_filepath == null || batch_filepath == null) {
      log_error('unable to get filenames from user');
      process.exit(-3);
    }
  }
} else {
  // get the filenames from process.argv
  keypair_filepath = process.argv[2];
  batch_filepath = process.argv[3];
}

// check for a solana-cli install
try {
  get_proc_output('solana', ['--version']);
} catch (e) {
  log_error(
    'solana-cli not found in PATH. please ensure that solana-cli is installed and added to PATH',
  );
  process.exit(-4);
}

// read the specified CSV file
var records = fs
  .readFileSync(batch_filepath, 'utf-8')
  .replace('\r', '')
  .split('\n');

// split all of the records by ','
for (let n = 0; n < records.length; n++) {
  records[n] = records[n].split(',');

  // strip any spaces
  for (let m = 0; m < records[n].length; m++)
    records[n][m] = records[n][m].trim();
}

// get the account's public key from the specified keypair file
var pub_key = get_proc_output('solana-keygen', ['pubkey', keypair_filepath]);
log_info('successfully initialized wallet with public key ' + pub_key);

// get the user's current keypair path, if they have one
var config_info = get_proc_output('solana', ['config', 'get']).split('\n');
var keypair_path = '';
for (let n = 0; n < config_info.length; n++) {
  // split/strip the config_info entry
  config_info[n] = config_info[n].split(':');
  for (let m = 0; m < config_info[n].length; m++)
    config_info[n][m] = config_info[n][m].trim();

  // search for the 'Keypair Path' entry
  if (config_info[n][0] == 'Keypair Path') {
    keypair_path = config_info[n][1];
    break;
  }
}
if (keypair_path != '') log_info('preserving keypair path of ' + keypair_path);
else
  log_info(
    'no keypair path found, setting keypair path to ' + keypair_filepath,
  );

// set the temporary keypair path
get_proc_output('solana', ['config', 'set', '--keypair', keypair_filepath]);

// define the name of the log file and a string to keep track of error addresses
var log_file_name =
  'transfer ' + new Date().toJSON().split(':').join('-') + '.log';
var log_data = '';
log_info('will write log file at ' + log_file_name);

// loop over all of the recipients
for (let n = 1; n < records.length; n++) {
  // initialize variables and prepare to send
  if (
    records[n].length == 0 ||
    records[n][0] == '' ||
    records[n][1] == '' ||
    records[n][2] == ''
  ) {
    log_info('encountered blank entry in CSV file, continuing to next record');
    continue;
  }
  let amount = records[n][0];
  let token = records[n][1];
  let recipient = records[n][2];
  log_info(
    'sending ' + amount + ' of token ' + token + ' to recipient ' + recipient,
  );

  // check for invalid wallet ID
  if (recipient.toLowerCase().startsWith('0x')) {
    log_error('invalid recipient wallet ID ' + recipient);
    log_info += recipient + '\n';
    continue;
  }

  // call the spl-token transfer command to send the specified token
  try {
    get_proc_output('spl-token', [
      'transfer',
      '--fund-recipient',
      token,
      amount,
      recipient,
    ]);
  } catch (e) {
    log_error('unable to perform transfer (' + e.toString() + ')');
    log_data += recipient + '\n';
  }
}

// restore the old keypair file if necessary
if (keypair_path != '') {
  get_proc_output('solana', ['config', 'set', '--keypair', keypair_path]);
  log_info('restored origin keypair path configuration');
}

// write the log file
log_info('writing log file ' + log_file_name);
fs.writeFileSync(log_file_name, log_data, (err) => {
  if (err) {
    log_error('error writing log file (' + err.toString() + ')');
    return;
  }
});
