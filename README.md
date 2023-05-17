# styched-hackathon-0001

IMPROVEMENTS:
1.  average cart value of approx. 750 over week/month is to be maintained
2.  Split up orders into line-items as one tailor does not do every line-item well
3.  use table component to present orders info
4.  have feature for rejecting a particular sku for quality issues. this should show on tailor dashboard as a negative commission.

# styched-hackathon-0002
IMPROVEMENTS:
* add 10k orders and 200 tailors. Let tailors complete jobs at random while choosing their own jobs. Add allocation date and completion date to SKU schema.
* Tailors might soft-cancel after choosing a job, so that job must come back to the open pool.
* Hard-cancel is done by QA folks, and the job has to be redone by another tailor.
* Orders are getting filled fast - need to find orders which can ship today if last piece can be completed
* Analytics - bin the SKUs in uniform bins to figure out which intervals are selling like hotcakes
* find count and total value of orders that can be shipped today
