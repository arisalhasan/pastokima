import {Problem} from './content.mjs';
// Strip JPEG application/comment segments (including EXIF/GPS and embedded thumbnails).
export function cleanJPEG(bytes){
 if(bytes[0]!==255||bytes[1]!==216)throw new Problem('Please upload a JPEG image.');
 const parts=[bytes.slice(0,2)];let p=2,dimensions=false;
 while(p<bytes.length){
  if(bytes[p]!==255)throw new Problem('Invalid JPEG file.');const marker=bytes[p+1];
  if(marker===0xda){if(!dimensions)throw new Problem('Image dimensions could not be verified.');parts.push(bytes.slice(p));break;}
  const length=(bytes[p+2]<<8)+bytes[p+3];if(length<2||p+2+length>bytes.length)throw new Problem('Damaged JPEG file.');
  if([0xc0,0xc1,0xc2].includes(marker)){const h=(bytes[p+5]<<8)+bytes[p+6],w=(bytes[p+7]<<8)+bytes[p+8];if(!w||!h||w>6000||h>6000||w*h>24000000)throw new Problem('Image dimensions are too large.');dimensions=true;}
  if(!(marker>=0xe0&&marker<=0xef)&&marker!==0xfe)parts.push(bytes.slice(p,p+2+length));p+=2+length;
 }
 if(!dimensions||bytes.at(-2)!==255||bytes.at(-1)!==217)throw new Problem('Invalid JPEG image.');
 const out=new Uint8Array(parts.reduce((n,x)=>n+x.length,0));let off=0;for(const part of parts){out.set(part,off);off+=part.length;}return out;
}
// Zero privacy metadata boxes without changing box lengths or media offsets.
export function cleanMP4(bytes){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);const type=p=>String.fromCharCode(...bytes.subarray(p+4,p+8));let ftyp=false,moov=false,mdat=false;
 const containers=new Set(['moov','trak','mdia','minf','stbl','edts','dinf','mvex','moof','traf']);
 function boxes(start,end,depth=0){if(depth>12)throw new Problem('Video container is too complex.');for(let p=start;p<end;){if(p+8>end)throw new Problem('Invalid MP4 container.');const size=view.getUint32(p),t=type(p);if(size<8||p+size>end)throw new Problem('Use a standard MP4 export (H.264).');if(depth===0){ftyp||=t==='ftyp';moov||=t==='moov';mdat||=t==='mdat';}
   if(['udta','meta','uuid'].includes(t)){bytes.set([102,114,101,101],p+4);bytes.fill(0,p+8,p+size);}
   else if(containers.has(t))boxes(p+8,p+size,depth+1);
   else if(t==='dref'){const s=String.fromCharCode(...bytes.subarray(p+8,Math.min(p+size,p+200)));if(/https?:|file:/.test(s))throw new Problem('External video references are not allowed.');}
   p+=size;}}
 boxes(0,bytes.length);if(!ftyp||!moov||!mdat)throw new Problem('Choose an MP4 video with video data.');return bytes;
}
