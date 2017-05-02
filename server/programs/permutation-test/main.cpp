/* log example */
#include <stdio.h>      /* printf */
#include <math.h>       /* log */
#include <unistd.h>
#include <stdlib.h>     /* srand, rand */
#include <time.h>       /* time */

int main ()
{
  srand (time(NULL));
  double param, result;
  param = 5.5;

  int min = 2, max = 30;
  int output = min + (rand() % (int)(max - min + 1));
  printf ("sleep(%d)\n", output );
  sleep(output);
  result = log (param);
  printf ("log(%f) = %f\n", param, result );
  printf ("success");
  return 0;
}