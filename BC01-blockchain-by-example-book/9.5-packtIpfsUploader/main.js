// Get a reference to the file path from the HTML.
const filePath = $('#filePath');

// Change the string displayed in the input to reflect the selected file.
$('#fileToUpload').on('change',function(){
  let fileName = $(this).val().split('\\').pop();
  $(this).next('.custom-file-label').html(fileName);
  filePath.hide();
});

function uploadFile() {
  // Create a new FileReader instance to read the file.
  const reader = new FileReader();

  // Define a function to be called once reading the file is complete.
  reader.onloadend = () => {
    // Call the IpfsApi constructor as a method of the global window object.
    const ipfs = window.IpfsApi('localhost', 5001);

    // Put the file data into a buffer that IPFS can work with.
    const buf = buffer.Buffer(reader.result);

    // Add the file buffer to IPFS, returning on error.
    ipfs.files.add(buf, (err, result) => {
      if (err) {
        console.error(err);
        return
      }

      // Form the IPFS URL to output to the user.
      const outputUrl = `https://ipfs.io/ipfs/${result[0].hash}`;
      const link = document.getElementById('ipfsUrl');
      link.href = outputUrl;
      document.getElementById("ipfsUrlString").innerHTML= outputUrl;

      // Show the URL to the user.
      filePath.show();
    });
  };

  // Get the file from the HTML input.
  const file = document.getElementById("fileToUpload");

  // Read the file into an ArrayBuffer, which represents the file as a
  // fixed-length raw binary data buffer.
  reader.readAsArrayBuffer(file.files[0]);
}