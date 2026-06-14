
import { Grid, Card, CardContent, Typography } from "@mui/material";

const stats=[
 {label:"Commits",value:"41"},
 {label:"Code Chunks",value:"56"},
 {label:"Jira Stories",value:"8"},
 {label:"Confluence",value:"10"}
];

export default function StatsCards(){
 return (
 <Grid container spacing={2} sx={{mb:3}}>
 {stats.map(x=>(
 <Grid item xs={12} md={3} key={x.label}>
 <Card>
 <CardContent>
 <Typography variant="h5">{x.value}</Typography>
 <Typography>{x.label}</Typography>
 </CardContent>
 </Card>
 </Grid>
 ))}
 </Grid>
 );
}
