import test from "node:test";
import assert from "node:assert/strict";
import {toMinutes,overlaps,hasConflict,validateAppointment,calculateEndTime,monthKey,sanitizePlainText} from "./app-core.js";

test("converte horário para minutos",()=>assert.equal(toMinutes("14:30"),870));
test("rejeita horário inválido",()=>assert.equal(toMinutes("25:00"),null));
test("detecta sobreposição de horários",()=>assert.equal(overlaps("14:00","15:00","14:30","15:30"),true));
test("não considera horários adjacentes como conflito",()=>assert.equal(overlaps("14:00","15:00","15:00","16:00"),false));
test("detecta conflito apenas no mesmo dia",()=>{
  const list=[{id:1,date:"2026-10-15",start:"14:00",end:"15:00",status:"confirmed"}];
  assert.equal(hasConflict(list,{date:"2026-10-15",start:"14:30",end:"15:30"}),true);
  assert.equal(hasConflict(list,{date:"2026-10-16",start:"14:30",end:"15:30"}),false);
});
test("valida campos obrigatórios",()=>{
  const result=validateAppointment({clientId:null,serviceId:null,date:"",start:"",end:""},[]);
  assert.equal(result.valid,false);
  assert.equal(Boolean(result.errors.clientId),true);
  assert.equal(Boolean(result.errors.serviceId),true);
});
test("calcula horário final com duração",()=>assert.equal(calculateEndTime("14:00",75),"15:15"));
test("funções auxiliares sanitizam e identificam mês",()=>{
  assert.equal(sanitizePlainText(" <b>Ana</b> "),"bAna/b");
  assert.equal(monthKey("2026-10-15"),"2026-10");
});
