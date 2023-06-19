import * as React from 'react';
import { Box, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { RHFSelect, RHFTextField } from '../../../components/hook-form';

export default function InputSoalForm() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        + Soal
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Soal #1</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormLabel id="jenis">Jenis Soal</FormLabel>
            <RadioGroup aria-label="jenis" name="jenis">
              <FormControlLabel value="pilihanGanda" control={<Radio />} label="Pilihan Ganda" />
              <FormControlLabel value="esai" control={<Radio />} label="Esai" />
            </RadioGroup>
          </Box>
          <Box sx={{ mt: 2 }}>
            <RHFTextField name="pertanyaan" label="Tulis Pertanyaan" />
          </Box>
          <Grid container spacing={2} sx={{ mt: 1 }} alignItems="center">
            <Grid item xs={9}>
              <TextField name="jawaban_1" label="Tulisan Jawaban 1" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={3}>
              <FormLabel id="jawaban">Jawaban yang Benar?</FormLabel>
              <RadioGroup aria-label="jawaban" name="jawaban" row>
                <FormControlLabel value="ya" control={<Radio />} label="Ya" />
                <FormControlLabel value="tidak" control={<Radio />} label="Tidak" />
              </RadioGroup>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={9}>
              <TextField name="jawaban_2" label="Tulisan Jawaban 2" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={3}>
              <FormLabel id="jawaban">Jawaban yang Benar?</FormLabel>
              <RadioGroup aria-label="jawaban" name="jawaban" row>
                <FormControlLabel value="ya" control={<Radio />} label="Ya" />
                <FormControlLabel value="tidak" control={<Radio />} label="Tidak" />
              </RadioGroup>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={9}>
              <TextField name="jawaban_3" label="Tulisan Jawaban 3" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={3}>
              <FormLabel id="jawaban">Jawaban yang Benar?</FormLabel>
              <RadioGroup aria-label="jawaban" name="jawaban" row>
                <FormControlLabel value="ya" control={<Radio />} label="Ya" />
                <FormControlLabel value="tidak" control={<Radio />} label="Tidak" />
              </RadioGroup>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={9}>
              <TextField name="jawaban_4" label="Tulisan Jawaban 4" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={3}>
              <FormLabel id="jawaban">Jawaban yang Benar?</FormLabel>
              <RadioGroup aria-label="jawaban" name="jawaban" row>
                <FormControlLabel value="ya" control={<Radio />} label="Ya" />
                <FormControlLabel value="tidak" control={<Radio />} label="Tidak" />
              </RadioGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Kembali</Button>
          <Button onClick={handleClose}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}