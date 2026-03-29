from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Note
from ..insecta_serializers import NoteReadSerializer, NoteWriteSerializer

# Note CRUD

@api_view(["GET", "POST"])
def noteListCreate(request):
    if request.method == "GET":
        notes = Note.objects.all().order_by("-noteCreated")
        serializer = NoteReadSerializer(notes, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        write = NoteWriteSerializer(data=request.data)
        if write.is_valid():
            note = write.save()
            read = NoteReadSerializer(note)
            return Response(read.data, status=status.HTTP_201_CREATED)
        return Response(write.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def noteDetail(request, id):
    try:
        note = Note.objects.get(id=id)
    except Note.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = NoteReadSerializer(note)
        return Response(serializer.data)

    elif request.method == 'PUT':
        write = NoteWriteSerializer(note, data=request.data)
        if write.is_valid():
            note = write.save()
            read = NoteReadSerializer(note)
            return Response(read.data)
        return Response(write.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':
        write = NoteWriteSerializer(note, data=request.data, partial=True)
        if write.is_valid():
            note = write.save()
            read = NoteReadSerializer(note)
            return Response(read.data)
        return Response(write.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


