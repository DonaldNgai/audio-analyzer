from pyAudioAnalysis import audioBasicIO as aIO
from pyAudioAnalysis import audioSegmentation as aS

import os
import matplotlib.pyplot as plt
import numpy as np
import wave
import soundfile as sf

from pathlib import PurePath
from pydub import AudioSegment

import librosa

def convertFlacToWav(path: str):
    file_path = PurePath(path)
    flac_tmp_audio_data = AudioSegment.from_file(file_path, file_path.suffix[1:])
    wavePath = file_path.name.replace(file_path.suffix, "") + ".wav"
    flac_tmp_audio_data.export(wavePath, format="wav")
    return wavePath

        


def visualizeWave(path: str,sil=None):
    raw = wave.open(path)
    signal = raw.readframes(-1)
    signal = np.frombuffer(signal, dtype ="int16")
    f_rate = raw.getframerate()
    time = np.linspace(
        0, # start
        len(signal) / f_rate,
        num = len(signal)
    )
    plt.figure(1)
    plt.title(os.path.basename(path))
    plt.xlabel("Time")
    plt.plot(time, signal)
    if sil:
        for i in sil:
            plt.axvline(x=i[0], color='red') 
            plt.axvline(x=i[1], color='red')
    plt.show()

def visualizeFlac(path: str,sil=None):
    data, samplerate = sf.read(path)
    times = np.linspace(0,len(data),len(data))/samplerate
    plt.plot(times,data)
    plt.title(os.path.basename(path))
    # plt.xlim(show.t_min, show.t_max)
    plt.ylim(-.1,.1)
    plt.ylabel('Time (s)')
    if sil:
        for i in sil:
            plt.axvline(x=i[0], color='red') 
            plt.axvline(x=i[1], color='red')
    plt.show()

def update_segments(filename,segments, sil_time):
    '''
    filename= audio file path
    segments= Active segment output from pyaudoanalysis
    sil_time = Silence time/ Time threshold above which silence to be considered

    returns:
    list of start and end of silent time frames
    '''
    ans=[]
    tmp=0
    n=len(segments)
    for  idx,t in enumerate(segments):
        if t[0]-tmp>=sil_time:
            ans.append((tmp,t[0]))
        tmp=t[1]
        if idx==n-1:
            fn=librosa.get_duration(path=filename)
            if fn-tmp>=sil_time:
                ans.append((tmp,fn))
    return ans

files=['./84-121123-0000.flac','./jPa7Xqr0.wav']
# files=['./jPa7Xqr0.wav']
for count, file in enumerate(files):
    if file.endswith('.flac'):
        wavPath = convertFlacToWav(file)
        files[count] = wavPath
        file = wavPath
    # visualizeWave(file)

for file in files:
    [Fs, x] = aIO.read_audio_file(file)
    segments = aS.silence_removal(x, 
                                 Fs, 
                                 0.020, #Short Term Window Size
                                 0.020, #Short Term Step Size
                                 smooth_window=0.8, #Window in seconds used to smooth the SVM probabilistic sequence
                                 weight=0.6, #a factor between 0 and 1 that specifies how "strict" the thresholding is
                                 plot=False) #From documentation, only change window and weight? For conversations, smaller window and stronger weight
    u_segments=update_segments(file,segments, 0) # Show all silences, regardless of silence length
    print(u_segments)
    if len(u_segments)>0:
        visualizeWave(file,u_segments)

# path='/audio_path'# below method returns the active / non silent segments of the audio file 
# [Fs, x] = aIO.read_audio_file(path)
# segments = aS.silence_removal(x, 
#                              Fs, 
#                              0.020, 
#                              0.020, 
#                              smooth_window=1.0, 
#                              weight=0.3, 
#                              plot=True)