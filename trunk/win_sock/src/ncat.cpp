/****************************************
 * ncat [http://][username:passwd@]domain[:port]/path
 *
 ************************************/

#include<stdio.h>
#include<stdlib.h>
#include<ctype.h>
#include<winsock.h>

typedef struct {
  int port;
  char authorization[256];
  char hostname[256];
} URL_INFO;

void usage(void);
void getPage(char *url);
void base64_encode(char *s, char *t); /* t is base64 encoded s */

int main(int argc, char *argv[]){
  WSADATA data;
  int i;

  if ( argc == 1 ) { usage(); return 0; }

  if(WSAStartup(MAKEWORD(2,0), &data)){
    fprintf(stderr, "failed : wsdata\n");
    return 0;
  }

  for( i=1; i<argc; i++) {
    getPage(argv[i]);
  }

  WSACleanup();

  return 0;
}

void getPage(char *url){
  HOSTENT *HostInfo;
  SOCKADDR_IN sin, fsin;
  SOCKET s;

  char request[2048], buf[65536];
  int nrecv;
  int i;
  char *cp1, *cp2, *h, *a, *path, *x;
  char port[256];

  URL_INFO t;  /* target */

  /* http:// */
  if ( ( cp1 = strchr(url, ':') ) == NULL ) cp1 = url;
  cp1+=3;

  if ( (cp2 = strchr(cp1, '/')) == NULL){
    return;
  }
  *cp2 = '\0';
  path = cp2 + 1;

  /* check authorization */
  if (( cp2 = strchr(cp1, '@') ) != NULL) {
    *cp2 = '\0';
    base64_encode(cp1, t.authorization);
    cp1 = cp2+1;
  } else { /* if no auth */
    t.authorization[0] = '\0';
  }

  /* get port */
  if (( cp2 = strchr(cp1, ':') ) != NULL ) {
    *cp2 = '\0';
    cp2++;
    for(t.port = 0; *cp2 != '\0'; cp2++ ){
      if ( isdigit(*cp2) ) t.port = t.port*10 + (*cp2-'0');
      else return;
    }
  } else { /* if url is not imply port, use default port 80 */
    t.port = 80;
  }

  strcpy(t.hostname, cp1);

  /** get local computer **/
  /** gethostname(t.hostname,sizeof(t.hostname)); **/

  if( (HostInfo = gethostbyname( t.hostname )) == NULL){
    fprintf(stderr, "gethostbyname failed\n");
    return;
  }

  if(!(s=socket(AF_INET, SOCK_STREAM, 0))){
    fprintf(stderr, "failed : socket\n");
    return;
  }

  memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_port = htons(t.port);
  memcpy(&sin.sin_addr, HostInfo->h_addr, HostInfo->h_length);

  if(connect(s, (struct sockaddr *)&sin, sizeof(sin))){
    fprintf(stderr, "failed : connect\n");
    WSACleanup();
    shutdown(s, 2);
    return;
  }

  sprintf(request, "GET /%s HTTP/1.0\n", path);
  if ( t.authorization[0] != '\0' ){
    strcat(request, "Authorization: Basic ");
    strcat(request, t.authorization);
    strcat(request, "\n");
  }
  strcat(request, "\n");
  send(s, request, strlen(request), 0);

  while(1){
    nrecv = recv(s, buf, sizeof(buf), 0);
    if ( nrecv == SOCKET_ERROR ){
      fprintf(stderr, "failed : accept\n");
      break;
    }

    if(nrecv==0) break;

    buf[nrecv]='\0';
    printf(buf);

  }

  shutdown(s, 2);

  closesocket(s);

  return;
}

void base64_encode(char *s, char *t){
  char base64[65] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  unsigned char x,y,w,z;
  while(1){
    if ( *s == '\0' ) break;
    x = (((unsigned char)*s)>>2) & 0x3f;
    *(t++) = base64[x];
    y = (((unsigned char)*s)<<4) & 0x30;
    s++;
    if ( *s == '\0' ) {
      *(t++) = base64[y];
      *(t++) = '=';
      *(t++) = '=';
      break;
    }
    y |= (((unsigned char)*s)>>4) & 0x0f;
    *(t++) = base64[y];
    w = (((unsigned char)*s)<<2) & 0x3c;
    s++;
    if ( *s == '\0' ) {
      *(t++) = base64[w];
      *(t++) = '=';
      break;
    }
    w |= (((unsigned char)*s)>>6) & 0x03;
    z = ((unsigned char)*s) & 0x3f;
    *(t++) = base64[w];
    *(t++) = base64[z];
    s++;
  }
  *(t++) = '=';
  *t = '\0';
}

void usage(void){
  puts("ncat http://username:password@host:port/path ....");
}
