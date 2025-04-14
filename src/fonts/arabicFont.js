import jsPDF from 'jspdf';
import arabicFont from './almarai-regular-base64';

jsPDF.API.events.push(['addFonts', function () {
  this.addFileToVFS('Almarai-Regular.ttf', arabicFont);
  this.addFont('Almarai-Regular.ttf', 'Almarai', 'normal');
}]);

// لا تكتب export هنا نهائيًا!
