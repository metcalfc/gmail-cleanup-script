/*
MIT License

Copyright (c) 2021 Chad Metcalf

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*

Much like Google automatically deletes spam emails older than 30 days, I wanted
to delete everything in the four catagories (promotions, social, forums, and 
updates).

I also added two labels crap and keep as catch alls. crap will schedule any
email for 30 day deletion. keep will ensure that any email regardless of
label or catagory will not be deleted.

*/ 
function Intialize() {
  return;
}

function Install() {
  
  ScriptApp.newTrigger("cleanupGmail")
           .timeBased().atHour(3).everyDays(1).create(); // every day @ 3am

}

function Uninstall() {
  
  var triggers = ScriptApp.getProjectTriggers()();
  for (var i=0; i<triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
}

function cleanupGmail() {
    
  var queryString =  ["category:promotions !label:keep older_than:30d",
                      "category:social !label:keep older_than:30d",
                      "category:forums !label:keep older_than:30d",
                      "category:updates !label:keep older_than:30d",
                      "label:crap !label:keep older_than:30d"];
       
  queryString.forEach(cleanupQuery);

}

function cleanupQuery(value) {

  Logger.log(value);

  try {
    
    var count = 0;
    var batchSize = 100 // Process up to 100 threads at once
  
    var threads = GmailApp.search(value);
    for (j = 0; j < threads.length; j+=batchSize) {
      var cleanupThreads = threads.slice(j, j+batchSize);
      count += cleanupThreads.length;
      GmailApp.moveThreadsToTrash(cleanupThreads);
    }
  
    Logger.log("Deleted emails: " + count);

  } catch (e) {}
}
