function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var payload = data.data;
    var result;

    switch(action) {
      case 'getOpenPurchases':
        result = getOpenPurchases();
        break;
      case 'saveStoreReceipt':
        result = saveStoreReceipt(payload);
        break;
      case 'getActiveSuppliers':
        result = getActiveSuppliers();
        break;
      case 'getActiveComponents':
        result = getActiveComponents();
        break;
      case 'checkDuplicateSerial':
        result = checkDuplicateManufacturerSerial(payload.serial);
        break;
      default:
        result = { success: false, error: 'Unknown action: ' + action };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false, error: err.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
