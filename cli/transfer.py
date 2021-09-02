# Solana batch transfer command line utility
#
# Requires that the Solana CLI be installed and located
# within your PATH variable
#

import ast  # ast.literal_eval
import csv  # csv.reader
from datetime import datetime  # now
import logging  # basicConfig, info
import subprocess  # run
import sys  # argv

# get_proc_output(cmd)
#
# takes a command as a string and returns its output as a string.
# throws an exception with the contents of stderr if the process
# writes to stderr.
def get_proc_output(cmd):
    proc = subprocess.Popen(
        cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    output, error = proc.communicate()

    if error != b"":
        raise Exception(error.decode("utf-8").strip())

    return output.decode("utf-8").strip()


# check for the correct amount of command line arguments
keypair_filepath = None
batch_filepath = None
if len(sys.argv) != 3 or "-?" in sys.argv:
    if len(sys.argv) != 1:
        print("usage: " + sys.argv[0] + " [keypair.json] [batch.csv]")
        print(
            "\n  - keypair.json must be a file containing your public/private keypair as an array of JSON integers."
        )
        print(
            "  - batch.csv must be a CSV file containing entries of all the desired transfers in the format:"
        )
        print("\n      AMOUNT,SPL_TOKEN_ADDRESS,RECIPIENT_WALLET_ADDRESS\n")
        print(
            "    the first record in batch.csv will be ignored as it is assumed to be column info.\n"
        )
        exit(-1)
    else:
        keypair_filepath = input("input path of keypair JSON file: ")
        batch_filepath = input("input path of batch CSV file:    ")
else:
    keypair_filepath = sys.argv[1]
    batch_filepath = sys.argv[2]

# set the logging format and level
logging.basicConfig(format="%(levelname)s: %(message)s", level=logging.INFO)

# check for a solana-cli install
try:
    get_proc_output("solana --version")
except (FileNotFoundError, Exception):
    logging.error(
        "solana-cli not found in PATH. please ensure that solana-cli is installed and added to PATH"
    )
    exit(-2)

# read the specified CSV file
batch_file = open(batch_filepath, "r")
batch_reader = csv.reader(batch_file)

# read all of the records
first = True
records = []
for record in batch_reader:
    if not first:
        records.append(record)
    else:
        first = False

# get the account's public key from the specified keypair file
pub_key = get_proc_output('solana-keygen pubkey "' + keypair_filepath + '"')
logging.info("successfully initialized wallet with public key " + pub_key)

# get the user's current keypair path, if they have one
config_info = [x.split(":") for x in get_proc_output("solana config get").split("\n")]
keypair_path = ""
for entry in config_info:
    entry = [x.strip() for x in entry]

    if entry[0] == "Keypair Path":
        keypair_path = entry[1]
        break
if keypair_path != "":
    logging.info("preserving keypair path of " + keypair_path)
else:
    logging.info("no keypair path found, setting keypair path to " + keypair_filepath)

# set the temporary keypair path
set_output = get_proc_output('solana config set --keypair "' + keypair_filepath + '"')

# open the log file
log_file = open(datetime.now().strftime("transfer %d-%m-%Y %H-%M-%S.log"), "w")
logging.info(
    "opened log file at " + datetime.now().strftime("transfer %d-%m-%Y %H-%M-%S.log")
)

# loop over all of the recipients
for record in records:
    # initialize the variables and prepare to send
    if len(record) == 0 or record[0] == "" or record[1] == "" or record[2] == "":
        logging.info("encountered blank entry in CSV file, continuing to next record")
        continue
    amount, token, recipient = record[0], record[1], record[2]
    logging.info(
        "sending " + amount + " of token " + token + " to recipient " + recipient
    )

    # check for invalid wallet id
    if recipient.lower().startswith("0x"):
        logging.error("invalid recipient wallet ID " + recipient)
        print(recipient, file=log_file)
        continue

    # call the spl-token transfer command to send the specified token
    try:
        output = get_proc_output(
            'spl-token transfer --fund-recipient "'
            + token
            + '" "'
            + amount
            + '" "'
            + recipient
            + '"'
        )
    except Exception as e:
        logging.error("unable to perform transfer (" + str(e) + ")")
        print(recipient, file=log_file)

# restore the old keypair file if necessary
if keypair_path != "":
    set_output = get_proc_output('solana config set --keypair "' + keypair_path + '"')
    logging.info("restored original keypair path configuration")

# close the log file
log_file.close()
