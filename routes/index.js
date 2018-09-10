var express = require('express');
var router = express.Router();
var UA = require('ua-device');
var moment = require('moment');
var archiver = require('archiver');
var fs = require('fs');

const logPath = './logs/';

/* GET home page. */
router.get('/', function(req, res, next) {

var ua = new UA(req.get('user-agent'));
var uaDevice = ua.device;
  var uaJson = {
    Date: moment().format(),
    Message:req.query,
    Device: `${ua.os.name}-${ua.os.version.original}-${uaDevice.manufacturer}`
  }  

  


  var logName = moment().format("YYYY-MM-DD")+'.log';
  

  fs.appendFile(logPath + logName, JSON.stringify(uaJson) + '\n', err => {
    

    var priDay = moment().add(-1, 'days').format("YYYY-MM-DD") + '.log';
    
    var fileExist = fsExistsSync(logPath + priDay)
    if(fileExist){
      var output = fs.createWriteStream(logPath + priDay.split('.')[0]+'.zip');
      var archive = archiver('zip');
      archive.pipe(output);
      archive.file(logPath + priDay, { name: priDay });
      archive.finalize();

      fs.unlinkSync(logPath + priDay);
    }
    

  })
  
  res.json(uaJson);
});


function fsExistsSync(path) {
  try{
      fs.accessSync(path,fs.F_OK);
  }catch(e){
      return false;
  }
  return true;
}


module.exports = router;
